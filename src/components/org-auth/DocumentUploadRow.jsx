import { useRef } from 'react';
import Icon from '../common/Icon.jsx';

function formatSize(bytes) {
  return bytes >= 1024 * 1024 ? `${(bytes / (1024 * 1024)).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

/**
 * DocumentUploadRow — one document of step 2.
 * Empty: dashed row with "Upload". Uploaded: green row with the file name, size and "Replace".
 */
export default function DocumentUploadRow({ doc, file, required, error, onSelect }) {
  const inputRef = useRef(null);
  const pick = () => inputRef.current && inputRef.current.click();

  return (
    <div className={`doc-row ${file ? 'uploaded' : ''} ${error ? 'has-error' : ''}`}>
      <span className="doc-icon">{file ? <Icon name="check" size={16} strokeWidth={2.6} /> : <Icon name="file" size={16} />}</span>
      <span className="doc-text">
        <span className="doc-title">
          {doc.label}
          {!required && !file && <span className="doc-optional"> · optional</span>}
        </span>
        {file ? (
          <span className="doc-meta">
            {file.name} · {formatSize(file.size)} · Uploaded
          </span>
        ) : (
          <span className="doc-hint">{error || doc.hint}</span>
        )}
      </span>
      {file ? (
        <button type="button" className="doc-replace" onClick={pick}>
          Replace
        </button>
      ) : (
        <button type="button" className="doc-upload" onClick={pick}>
          Upload <Icon name="upload" size={13} />
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={doc.accept}
        hidden
        onChange={(e) => {
          onSelect(e.target.files[0]);
          e.target.value = '';
        }}
      />
    </div>
  );
}
