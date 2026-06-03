"use client";

import { useRef, useState, useCallback } from "react";
import { Upload, X, UserCircle, Loader2, AlertCircle } from "lucide-react";

interface PhotoUploadProps {
  value?: string | null;
  onChange: (url: string) => void;
}

export function PhotoUpload({ value, onChange }: PhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file (JPG, PNG, WebP).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("File too large — max 5 MB.");
      return;
    }
    setError(null);
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("photo", file);
      const res = await fetch("/api/cv/photo", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Upload failed");
      onChange(json.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }, [onChange]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) upload(file);
  }, [upload]);

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-700">Profile Photo</label>
        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-500">
          optional
        </span>
      </div>

      <div className="flex items-center gap-3">
        {/* Current photo or placeholder */}
        <div className="relative shrink-0">
          {value ? (
            <>
              <div className="h-16 w-16 overflow-hidden rounded-full border-2 border-gray-200">
                <img src={value} alt="Profile" className="h-full w-full object-cover" />
              </div>
              <button
                type="button"
                onClick={() => { onChange(""); setError(null); }}
                className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white shadow hover:bg-red-600"
                title="Remove photo"
              >
                <X className="h-3 w-3" />
              </button>
            </>
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-dashed border-gray-300 bg-gray-50">
              <UserCircle className="h-8 w-8 text-gray-300" />
            </div>
          )}
        </div>

        {/* Drop zone */}
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={`flex flex-1 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed py-4 transition-colors
            ${dragging ? "border-indigo-400 bg-indigo-50" : "border-gray-200 bg-gray-50 hover:border-indigo-300 hover:bg-indigo-50"}
            ${uploading ? "pointer-events-none opacity-50" : ""}`}
        >
          {uploading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin text-indigo-500" />
              <span className="text-xs text-gray-500">Uploading…</span>
            </>
          ) : (
            <>
              <Upload className="h-5 w-5 text-gray-400" />
              <p className="text-xs text-gray-500">
                <span className="font-semibold text-indigo-600">Click to upload</span> or drag &amp; drop
              </p>
              <p className="text-[10px] text-gray-400">JPG · PNG · WebP — max 5 MB</p>
            </>
          )}
        </button>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); e.target.value = ""; }}
        />
      </div>

      {/* Non-blocking error — dismissible, with reassurance that the form can still be saved */}
      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-amber-800">{error}</p>
            <p className="mt-0.5 text-[10px] text-amber-600">You can still save your CV without a photo.</p>
          </div>
          <button
            type="button"
            onClick={() => setError(null)}
            className="shrink-0 text-amber-400 hover:text-amber-600"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
