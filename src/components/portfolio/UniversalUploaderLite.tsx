// src/components/portfolio/UniversalUploaderLite.tsx
import React, { useRef, useState } from "react";

type Holding = {
  symbol: string;
  name?: string;
  shares: number;
  price: number;
  market_value: number;
  sector?: string;
  cost_basis?: number;
  currency?: string;
  weight?: number;
};

export type ParseResult = {
  holdings: Holding[];
  totals: { total_value: number; positions_count: number };
  metadata: {
    custodianDetected: string;
    confidence: number;
    transparency_score?: number;
    batch_mode?: string;
    files?: Array<{ filename: string; type: string; confidence: number; require_mapping: boolean }>;
  };
};

type Props = {
  onDataParsed: (result: ParseResult) => void;
  isDarkMode?: boolean;
};

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

const UniversalUploaderLite: React.FC<Props> = ({ onDataParsed, isDarkMode = false }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setDragging] = useState(false);
  const [status, setStatus] = useState<"idle" | "uploading" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const [lastSummary, setLastSummary] = useState<{ files: number; value: number } | null>(null);

  const theme = {
    card: isDarkMode ? "bg-gray-800 border-gray-600" : "bg-white border-gray-200",
    text: isDarkMode ? "text-gray-100" : "text-gray-800",
    muted: isDarkMode ? "text-gray-300" : "text-gray-500",
    dashed: isDarkMode ? "border-gray-600" : "border-gray-300",
    active: isDarkMode ? "border-blue-400 bg-blue-900" : "border-blue-500 bg-blue-50",
  };

  async function handleFiles(files: FileList) {
    setStatus("uploading");
    setError("");
    setLastSummary(null);

    try {
      const form = new FormData();
      Array.from(files).forEach((f) => form.append("files", f));
      // optional: pass firm/client if you already have them
      form.append("firm_id", "1");
      form.append("client_id", "1");

      const resp = await fetch(`${API_BASE}/v3/universal/upload`, { method: "POST", body: form });
      if (!resp.ok) throw new Error(`Upload failed: ${resp.status}`);
      const data: ParseResult = await resp.json();

      // Forward to your existing dashboard
      onDataParsed(data);

      setLastSummary({
        files: files.length,
        value: data?.totals?.total_value ?? 0,
      });
      setStatus("done");
    } catch (e: any) {
      setError(e?.message || "Upload failed");
      setStatus("error");
    }
  }

  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer?.files?.length) handleFiles(e.dataTransfer.files);
  }

  return (
    <div className={`w-full border rounded-xl p-4 ${theme.card}`}>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-all ${
          isDragging ? theme.active : theme.dashed
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".csv,.tsv,.txt,.xlsx"
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
        <button
          onClick={() => inputRef.current?.click()}
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          Upload Multiple Files (Universal)
        </button>
        <p className={`mt-2 text-sm ${theme.muted}`}>
          Supports CSV / TSV / XLSX • Auto-detects custodian formats • Combines into one portfolio
        </p>

        {status === "uploading" && (
          <div className="mt-3 text-blue-600">Analyzing & normalizing…</div>
        )}
        {status === "error" && <div className="mt-3 text-red-600">Error: {error}</div>}
        {status === "done" && lastSummary && (
          <div className={`mt-3 text-sm ${theme.text}`}>
            <span className="font-semibold">Processed:</span> {lastSummary.files} file(s) •{" "}
            <span className="font-semibold">Total MV:</span> ${lastSummary.value.toLocaleString()}
          </div>
        )}
      </div>
    </div>
  );
};

export default UniversalUploaderLite;