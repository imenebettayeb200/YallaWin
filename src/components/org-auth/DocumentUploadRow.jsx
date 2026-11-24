import { formatFileSize } from "../../utils";
import Icon from "../common/Icon";

/*
 * DocumentUploadRow — one document of step 2 of "Apply to get verified".
 * Empty: dashed row with "Upload". Uploaded: green row with the file name, size and "Replace".
 * The <label> around the hidden file input opens the file picker when clicked.
 */
function DocumentUploadRow({ doc, file, required, error, onSelect }) {
  return (
    <div className={"doc-row " + (file ? "uploaded " : "") + (error ? "has-error" : "")}>
      <span className="doc-icon">
        {file ? <Icon name="check" size={16} strokeWidth={2.6}></Icon> : <Icon name="file" size={16}></Icon>}
      </span>
      <span className="doc-text">
        <span className="doc-title">
          {doc.label}
          {!required && !file && <span className="doc-optional"> · optional</span>}
        </span>
        {file ? (
          <span className="doc-meta">
            {file.name} · {formatFileSize(file.size)} · Uploaded
          </span>
        ) : (
          <span className="doc-hint">{error || doc.hint}</span>
        )}
      </span>
      <label className={file ? "doc-replace" : "doc-upload"}>
        {file ? "Replace" : "Upload"} {!file && <Icon name="upload" size={13}></Icon>}
        <input
          type="file"
          accept={doc.accept}
          hidden
          onChange={(e) => {
            onSelect(e.target.files[0]);
            e.target.value = "";
          }}
        />
      </label>
    </div>
  );
}

export default DocumentUploadRow;
