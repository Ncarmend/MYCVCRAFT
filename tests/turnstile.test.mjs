// Unit tests for lib/turnstile.ts — Cloudflare's Siteverify API is mocked.
// Run: npm test   (Node's built-in test runner; Node >= 22.18 strips the TS types)
import { test } from "node:test";
import assert from "node:assert/strict";
import { turnstileConfig, verifyTurnstileToken, SITEVERIFY_URL, PRODUCTION_HOSTNAMES } from "../lib/turnstile.ts";

/** Fake fetch answering like Siteverify; records each call. */
function siteverify(reply) {
  const calls = [];
  const fetchImpl = async (url, init) => {
    calls.push({ url, method: init.method, body: new URLSearchParams(init.body) });
    if (reply instanceof Error) throw reply;
    if (typeof reply === "function") return reply();
    return { ok: true, status: 200, json: async () => reply };
  };
  return { fetchImpl, calls };
}
const PROD = { secret: "s3cret", hostnames: PRODUCTION_HOSTNAMES };
const ok = (extra = {}) => ({ success: true, hostname: "www.cvixeo.com", action: "contact", "error-codes": [], ...extra });

test("valid token for www.cvixeo.com / action contact → ok; POSTs secret, token and IP", async () => {
  const { fetchImpl, calls } = siteverify(ok());
  assert.deepEqual(await verifyTurnstileToken("tok", { ...PROD, remoteIp: "203.0.113.9", fetchImpl }), { ok: true });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, SITEVERIFY_URL);
  assert.equal(calls[0].method, "POST");
  assert.equal(calls[0].body.get("secret"), "s3cret");
  assert.equal(calls[0].body.get("response"), "tok");
  assert.equal(calls[0].body.get("remoteip"), "203.0.113.9");
});

test("missing / empty / non-string / oversized token → rejected without calling Cloudflare", async () => {
  for (const token of [undefined, null, "", "   ", 42, { a: 1 }, "x".repeat(2049)]) {
    const { fetchImpl, calls } = siteverify(ok());
    assert.deepEqual(await verifyTurnstileToken(token, { ...PROD, fetchImpl }), { ok: false, reason: "missing_token" });
    assert.equal(calls.length, 0);
  }
});

test("invalid, expired or reused token → invalid_token", async () => {
  for (const code of ["invalid-input-response", "timeout-or-duplicate", "bad-request"]) {
    const { fetchImpl } = siteverify({ success: false, "error-codes": [code] });
    const r = await verifyTurnstileToken("tok", { ...PROD, fetchImpl });
    assert.equal(r.ok, false);
    assert.equal(r.reason, "invalid_token");
    assert.deepEqual(r.errorCodes, [code]);
  }
});

test("bad secret or Cloudflare internal error → unavailable (not the visitor's fault)", async () => {
  for (const code of ["invalid-input-secret", "missing-input-secret", "internal-error"]) {
    const { fetchImpl } = siteverify({ success: false, "error-codes": [code] });
    assert.equal((await verifyTurnstileToken("tok", { ...PROD, fetchImpl })).reason, "unavailable");
  }
});

test("network error, timeout, HTTP 5xx and malformed JSON → unavailable, never success", async () => {
  const cases = [
    new Error("ECONNRESET"),
    () => ({ ok: false, status: 502, json: async () => ({}) }),
    () => ({ ok: true, status: 200, json: async () => { throw new SyntaxError("bad json"); } }),
    () => ({ ok: true, status: 200, json: async () => null }),
    () => ({ ok: true, status: 200, json: async () => ({ success: "true" }) }),
  ];
  for (const reply of cases) {
    const { fetchImpl } = siteverify(reply);
    const r = await verifyTurnstileToken("tok", { ...PROD, fetchImpl });
    assert.equal(r.ok, false);
    assert.equal(r.reason, "unavailable");
  }
  // real timeout: a fetch that never answers before the abort signal fires
  // (AbortSignal.timeout doesn't keep the event loop alive, so hold it open with a timer)
  const hanging = (_url, init) => new Promise((_, reject) => {
    const keepAlive = setTimeout(() => {}, 5000);
    init.signal.addEventListener("abort", () => { clearTimeout(keepAlive); reject(init.signal.reason); });
  });
  assert.equal((await verifyTurnstileToken("tok", { ...PROD, fetchImpl: hanging, timeoutMs: 50 })).reason, "unavailable");
});

test("production hostname check", async () => {
  for (const hostname of ["www.cvixeo.com", "cvixeo.com", "WWW.CVIXEO.COM"]) {
    const { fetchImpl } = siteverify(ok({ hostname }));
    assert.equal((await verifyTurnstileToken("tok", { ...PROD, fetchImpl })).ok, true, hostname);
  }
  for (const hostname of ["evil.example", "cvixeo.com.evil.example", "localhost", "example.com", "", undefined]) {
    const { fetchImpl } = siteverify(ok({ hostname }));
    assert.equal((await verifyTurnstileToken("tok", { ...PROD, fetchImpl })).reason, "hostname_mismatch", String(hostname));
  }
});

test("action must be 'contact' in production; a different action is always rejected", async () => {
  for (const action of ["login", "", undefined]) {
    const { fetchImpl } = siteverify(ok({ action }));
    assert.equal((await verifyTurnstileToken("tok", { ...PROD, fetchImpl })).reason, "action_mismatch", String(action));
  }
  // no hostname list (local/preview): Cloudflare test keys return no action → allowed, but a wrong one isn't
  assert.equal((await verifyTurnstileToken("tok", { secret: "s", hostnames: null, fetchImpl: siteverify(ok({ hostname: "example.com", action: "" })).fetchImpl })).ok, true);
  assert.equal((await verifyTurnstileToken("tok", { secret: "s", hostnames: null, fetchImpl: siteverify(ok({ action: "signup" })).fetchImpl })).reason, "action_mismatch");
});

test("config: secret set → enforce; production checks the CVixeo hostnames", () => {
  assert.deepEqual(turnstileConfig({ TURNSTILE_SECRET_KEY: "k", VERCEL_ENV: "production", NODE_ENV: "production" }), { mode: "enforce", secret: "k", hostnames: PRODUCTION_HOSTNAMES });
  assert.deepEqual(turnstileConfig({ TURNSTILE_SECRET_KEY: "k", VERCEL_ENV: "preview", NODE_ENV: "production" }), { mode: "enforce", secret: "k", hostnames: null });
  assert.deepEqual(turnstileConfig({ TURNSTILE_SECRET_KEY: "k", NODE_ENV: "development" }), { mode: "enforce", secret: "k", hostnames: null });
  assert.deepEqual(turnstileConfig({ TURNSTILE_SECRET_KEY: "k", NODE_ENV: "development", TURNSTILE_ALLOWED_HOSTNAMES: " localhost , Preview.Example " }), { mode: "enforce", secret: "k", hostnames: ["localhost", "preview.example"] });
});

test("config: missing secret is never a silent bypass on a deployment", () => {
  assert.deepEqual(turnstileConfig({ VERCEL_ENV: "production", NODE_ENV: "production" }), { mode: "misconfigured" });
  assert.deepEqual(turnstileConfig({ VERCEL_ENV: "preview", NODE_ENV: "production" }), { mode: "misconfigured" });
  assert.deepEqual(turnstileConfig({ NODE_ENV: "production" }), { mode: "misconfigured" }); // next start
  assert.deepEqual(turnstileConfig({ TURNSTILE_SECRET_KEY: "  ", VERCEL_ENV: "production" }), { mode: "misconfigured" });
  assert.deepEqual(turnstileConfig({ NODE_ENV: "development" }), { mode: "skip" }); // local `next dev` only
});
