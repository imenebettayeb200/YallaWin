import { useRef, useState } from 'react';
import Icon from '../common/Icon.jsx';
import { readImage } from '../../utils/image.js';

/** Drag & drop / browse cover image, with "generate a cover" fallback. */
export default function CoverUpload({ value, onChange, onGenerate, onError, disabled = false }) {
  const fileRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = async (file) => {
    try {
      onChange(await readImage(file));
    } catch (err) {
      onError(err.message);
    }
  };

  const browse = () => {
    if (!disabled && fileRef.current) fileRef.current.click();
  };

  return (
    <div
      className={`dropzone ${dragOver ? 'drag' : ''} ${value ? 'has-image' : ''}`}
      role="button"
      tabIndex={0}
      onClick={browse}
      onKeyDown={(e) => e.key === 'Enter' && browse()}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        if (!disabled) handleFile(e.dataTransfer.files[0]);
      }}
    >
      {value ? (
        <>
          <img src={value} alt="Cover preview" />
          {!disabled && (
            <button
              type="button"
              className="dropzone-remove"
              onClick={(e) => {
                e.stopPropagation();
                onChange(null);
              }}
            >
              <Icon name="x" size={14} /> Remove
            </button>
          )}
        </>
      ) : (
        <>
          <span className="dropzone-icon">
            <Icon name="image" size={18} />
          </span>
          <span className="dropzone-title">Drop a cover image or browse</span>
          <span className="dropzone-hint">JPG or PNG · 1600×1000 recommended</span>
          <button
            type="button"
            className="link-blue link-button small"
            onClick={(e) => {
              e.stopPropagation();
              onGenerate();
            }}
          >
            <Icon name="sparkle" size={12} /> or generate a cover
          </button>
        </>
      )}
      <input
        ref={fileRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        hidden
        onChange={(e) => {
          handleFile(e.target.files[0]);
          e.target.value = '';
        }}
      />
    </div>
  );
}
