import { useState } from "react";
import { readImage } from "../../utils";
import Icon from "../common/Icon";

/*
 * CoverUpload — drop an image on the box, or click it to browse your files.
 * Without an image, the event gets a colourful cover drawn from its category.
 */
function CoverUpload({ value, onChange, onError, disabled }) {
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (file) => {
    readImage(file, onChange, onError);
  };

  return (
    <label
      className={"dropzone " + (dragOver ? "drag " : "") + (value ? "has-image" : "")}
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
                e.preventDefault();
                onChange("");
              }}
            >
              <Icon name="x" size={14}></Icon> Remove
            </button>
          )}
        </>
      ) : (
        <>
          <span className="dropzone-icon">
            <Icon name="image" size={18}></Icon>
          </span>
          <span className="dropzone-title">Drop a cover image or browse</span>
          <span className="dropzone-hint">JPG or PNG · 1600×1000 recommended · optional</span>
        </>
      )}
      <input
        type="file"
        accept="image/png,image/jpeg,image/webp"
        hidden
        disabled={disabled}
        onChange={(e) => {
          handleFile(e.target.files[0]);
          e.target.value = "";
        }}
      />
    </label>
  );
}

export default CoverUpload;
