import Panel from "../common/Panel";
import CoverUpload from "./CoverUpload";
import IconField from "./IconField";
import CategoryChips from "./CategoryChips";

function BasicsSection({ form, errors, update, readOnly, onError }) {
  return (
    <Panel className="form-panel">
      <h2 className="panel-title">Basics</h2>
      <CoverUpload value={form.image} disabled={readOnly} onChange={(image) => update({ image })} onError={onError} />
      <IconField
        label="Event title"
        icon="pencil"
        value={form.title}
        maxLength={80}
        placeholder="Sunset Pottery Session"
        error={errors.title}
        onChange={(e) => update({ title: e.target.value })}
      />
      <CategoryChips value={form.category} onChange={(category) => update({ category })} />
      <label className="field">
        <span className="field-label">Description</span>
        <textarea
          className={`input textarea ${errors.description ? "input-error" : ""}`}
          rows={3}
          maxLength={1000}
          placeholder="Tell people what to expect…"
          value={form.description}
          onChange={(e) => update({ description: e.target.value })}
        />
        {errors.description && <span className="field-error">{errors.description}</span>}
      </label>
    </Panel>
  );
}

export default BasicsSection;
