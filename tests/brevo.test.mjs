// Unit tests for lib/brevo.ts — Brevo's API is mocked, nothing is sent.
// Run: npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import { sendBrevoEmail, BREVO_SEND_URL } from "../lib/brevo.ts";

function brevo(reply) {
  const calls = [];
  const fetchImpl = async (url, init) => {
    calls.push({ url, init, body: JSON.parse(init.body) });
    if (reply instanceof Error) throw reply;
    return { ok: reply.status < 400, status: reply.status, json: async () => reply.body };
  };
  return { fetchImpl, calls };
}

const EMAIL = {
  sender: { email: "noreply@cvixeo.com", name: "CVixeo Contact" },
  to: [{ email: "support@example.com" }],
  replyTo: { email: "visitor@example.com" },
  subject: "[Contact] Hello",
  htmlContent: "<p>Hi</p>",
};

test("success → ok with messageId; POSTs JSON with the api-key header", async () => {
  const { fetchImpl, calls } = brevo({ status: 201, body: { messageId: "<abc@smtp-relay.mailin.fr>" } });
  assert.deepEqual(await sendBrevoEmail(EMAIL, { apiKey: "xkeysib-test", fetchImpl }), { ok: true, messageId: "<abc@smtp-relay.mailin.fr>" });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, BREVO_SEND_URL);
  assert.equal(calls[0].init.method, "POST");
  assert.equal(calls[0].init.headers["api-key"], "xkeysib-test");
  assert.deepEqual(calls[0].body, EMAIL);
});

test("unauthenticated sender / bad request → error code and message from Brevo", async () => {
  const { fetchImpl } = brevo({ status: 400, body: { code: "invalid_parameter", message: "Sender is not valid" } });
  assert.deepEqual(await sendBrevoEmail(EMAIL, { apiKey: "k", fetchImpl }), { ok: false, status: 400, code: "invalid_parameter", message: "Sender is not valid" });
});

test("wrong API key → 401 unauthorized", async () => {
  const { fetchImpl } = brevo({ status: 401, body: { code: "unauthorized", message: "Key not found" } });
  const r = await sendBrevoEmail(EMAIL, { apiKey: "k", fetchImpl });
  assert.equal(r.ok, false);
  assert.equal(r.code, "unauthorized");
});

test("non-JSON error body → http_<status>", async () => {
  const fetchImpl = async () => ({ ok: false, status: 502, json: async () => { throw new SyntaxError("bad json"); } });
  assert.deepEqual(await sendBrevoEmail(EMAIL, { apiKey: "k", fetchImpl }), { ok: false, status: 502, code: "http_502", message: "" });
});

test("network failure → network_error, no throw", async () => {
  const { fetchImpl } = brevo(new TypeError("fetch failed"));
  const r = await sendBrevoEmail(EMAIL, { apiKey: "k", fetchImpl });
  assert.equal(r.ok, false);
  assert.equal(r.code, "network_error");
});

test("missing or blank API key → no request is made", async () => {
  for (const apiKey of [undefined, "", "   "]) {
    const { fetchImpl, calls } = brevo({ status: 201, body: {} });
    const r = await sendBrevoEmail(EMAIL, { apiKey, fetchImpl });
    assert.equal(r.code, "missing_api_key");
    assert.equal(calls.length, 0);
  }
});
