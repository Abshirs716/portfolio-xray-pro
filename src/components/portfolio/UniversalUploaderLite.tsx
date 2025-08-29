// src/components/portfolio/UniversalUploaderLite.tsx
import React, { useState, useCallback, useRef } from 'react';
import { Upload, X, FileText, AlertCircle, CheckCircle } from 'lucide-react';

export interface ParseResult {
  holdings: Array<{
    symbol: string;
    name?: string;
    shares: number;
    price: number;
    market_value: number;
    weight?: number;
    cost_basis?: number;
    sector?: string;
    currency?: string;
  }>;
  totals: { total_value: number; positions_count: number; };
  metadata: {
    custodianDetected: string;
    confidence: number;
    files?: Array<{
      filename: string;
      type: string;
      confidence: number;
      require_mapping: boolean;
      headers?: string[];
      sample_rows?: string[][];
      index_map?: Record<string, number>;
      errors?: string[];
    }>;
  };
}

interface Props {
  onDataParsed: (result: ParseResult) => void;
  isDarkMode: boolean;
}

const canon = (s: string) => (s || '').toLowerCase().replace(/[^a-z0-9]+/g, '');

const ALIASES: Record<string, string[]> = {
  symbol: ['symbol','ticker','security','securitysymbol','securityid','cusip','isin','sedol','mysymbol'],
  shares: ['shares','quantity','qty','units','unitsheld','positionqty','positionquantity','position','holdings'],
  price:  ['price','unitprice','shareprice','pricepershare','lastprice','closeprice','marketprice','currentprice','nav','px'],
  market_value: ['marketvalue','value','mv','currentvalue','positionvalue','marketval','marketvalueusd','currentmarketvalue','valusd','valueusd','mktvalue','mvusd'],
};

function pickHeader(headers: string[] = [], candidates: string[]): string | undefined {
  const ch = headers.map(canon);
  let bestIdx = -1, bestScore = 0;
  for (let i=0;i<ch.length;i++){
    const h = ch[i];
    for (const a of candidates){
      let score = 0;
      if (h === a) { score = 300; }
      else if (h.endsWith(a) || a.endsWith(h)) { score = 200; }
      else if (h.includes(a)) { score = 120; }
      
      if (score > bestScore) {
        bestScore = score;
        bestIdx = i;
      }
    }
  }
  return bestIdx >= 0 ? headers[bestIdx] : undefined;
}

function buildAutoMapping(files: ParseResult['metadata']['files'] = []) {
  const mapping: Record<string, Record<string,string>> = {};
  for (const f of files) {
    if (!f || !f.filename || !f.headers) continue;
    const map: Record<string,string> = {};
    const s = pickHeader(f.headers, ALIASES.symbol); if (s) map.symbol = s;
    const q = pickHeader(f.headers, ALIASES.shares); if (q) map.shares = q;
    const p = pickHeader(f.headers, ALIASES.price);  if (p) map.price = p;
    const v = pickHeader(f.headers, ALIASES.market_value); if (v) map.market_value = v;
    if (Object.keys(map).length) mapping[f.filename] = map;
  }
  return mapping;
}

const UniversalUploaderLite: React.FC<Props> = ({ onDataParsed, isDarkMode }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parseResult, setParseResult] = useState<ParseResult | null>(null);
  const [autoMapped, setAutoMapped] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles(selectedFiles);
    setError(null);
  };
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles(droppedFiles); setError(null);
  }, []);
  const handleDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); }, []);
  const removeFile = (index: number) => setFiles(files.filter((_, i) => i !== index));

  const postUpload = async (mapping?: Record<string, Record<string,string>>) => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    if (mapping && Object.keys(mapping).length > 0) {
      formData.append('mapping', JSON.stringify(mapping));
    }
    const res = await fetch('http://localhost:8000/v3/universal/upload', { method: 'POST', body: formData });
    if (!res.ok) throw new Error(`Upload failed: ${res.statusText}`);
    return res.json();
  };

  const handleUpload = async () => {
    if (files.length === 0) { setError('Please select files to upload'); return; }
    setUploading(true); setError(null); setAutoMapped(false);

    try {
      // 1st pass
      let result: ParseResult = await postUpload();
      console.log('[First pass result]:', result);
      
      // If zero positions but mapping is required → build auto mapping and retry once
      const filesInfo = result?.metadata?.files || [];
      const needsMapping = filesInfo.some(f => f.require_mapping);
      console.log('[Needs mapping check]:', { positions: result.totals.positions_count, needsMapping, autoMapped });
      
      if ((result.totals.positions_count === 0 || needsMapping) && !autoMapped) {
        const mapping = buildAutoMapping(filesInfo);
        console.log('[Auto mapping built]:', mapping);
        
        if (Object.keys(mapping).length > 0) {
          setAutoMapped(true);
          result = await postUpload(mapping); // 2nd pass with mapping
          console.log('[Second pass result]:', result);
        }
      }
      setParseResult(result);
      onDataParsed(result);
      setFiles([]);
    } catch (err: any) {
      setError(err.message || 'Failed to upload files');
    } finally {
      setUploading(false);
    }
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(value);

  const uploadZoneStyle: React.CSSProperties = {
    border: '2px dashed #4a5568', borderRadius: '8px', padding: '2rem', textAlign: 'center',
    cursor: 'pointer', backgroundColor: isDarkMode ? '#1a202c' : '#f7fafc', transition: 'all 0.3s',
  };
  const fileItemStyle: React.CSSProperties = {
    display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem',
    backgroundColor: isDarkMode ? '#2d3748' : '#e2e8f0', borderRadius: '4px', marginTop: '0.5rem',
  };
  const buttonStyle: React.CSSProperties = {
    marginTop: '1rem', padding: '0.75rem 2rem', backgroundColor: '#4299e1', color: 'white',
    border: 'none', borderRadius: '6px', fontSize: '1rem', cursor: uploading ? 'not-allowed' : 'pointer',
    opacity: uploading ? 0.5 : 1,
  };

  return (
    <div>
      <div
        style={uploadZoneStyle}
        onDrop={handleDrop} onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
      >
        <input ref={fileInputRef} type="file" multiple accept=".csv,.tsv,.xlsx,.xls,.txt" onChange={handleFileSelect} style={{ display: 'none' }} />
        <Upload size={32} style={{ margin: '0 auto', color: '#4299e1' }} />
        <h3>Upload Multiple Files (Universal)</h3>
        <p>Supports CSV / TSV / XLSX / TXT • Auto-detects custodian formats • Combines into one portfolio</p>

        {files.length > 0 && (
          <div onClick={(e) => e.stopPropagation()}>
            {files.map((file, index) => (
              <div key={index} style={fileItemStyle}>
                <FileText size={16} /><span style={{ flex: 1 }}>{file.name}</span>
                <button onClick={() => removeFile(index)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#e53e3e' }}>
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: '#fc8181', borderRadius: '4px',
                        display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={16} /><span>Error: {error}</span>
          </div>
        )}

        {parseResult && (
          <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: '#48bb78', borderRadius: '4px',
                        display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle size={16} />
            <span>
              Processed: {parseResult.totals.positions_count} positions • Total MV: {formatCurrency(parseResult.totals.total_value)}
              {autoMapped && <em style={{ marginLeft: 8, opacity: 0.8 }}>(auto-mapped)</em>}
            </span>
          </div>
        )}
      </div>

      {files.length > 0 && (
        <button style={buttonStyle} onClick={handleUpload} disabled={uploading}>
          {uploading ? 'Processing...' : 'Process Files'}
        </button>
      )}
    </div>
  );
};

export default UniversalUploaderLite;