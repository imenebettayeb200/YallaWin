import Icon from "../common/Icon";

/** Header buttons: Delete · Save draft · Publish event / Save changes */
function EventFormActions({ canDelete, canSaveDraft, isPublished, readOnly, onDelete, onSaveDraft, onPublish }) {
  if (readOnly) return null;
  return (
    <>
      {canDelete && (
        <button type="button" className="btn btn-outline btn-danger" onClick={onDelete}>
          <Icon name="trash" size={15} /> Delete
        </button>
      )}
      {canSaveDraft && (
        <button type="button" className="btn btn-outline" onClick={onSaveDraft}>
          Save draft
        </button>
      )}
      <button type="button" className="btn btn-gradient" onClick={onPublish}>
        {isPublished ? "Save changes" : "Publish event"} <Icon name="arrowRight" size={16} />
      </button>
    </>
  );
}

export default EventFormActions;
