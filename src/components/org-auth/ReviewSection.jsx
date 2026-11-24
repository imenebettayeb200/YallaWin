import Icon from '../common/Icon.jsx';

/** ReviewSection — grey box of step 3: title, "✎ Edit" link and label/value rows. */
export default function ReviewSection({ title, rows, onEdit }) {
  return (
    <section className="review-box">
      <div className="review-box-head">
        <h2>{title}</h2>
        <button type="button" className="link-blue link-button small" onClick={onEdit}>
          <Icon name="pencil" size={12} /> Edit
        </button>
      </div>
      <dl>
        {rows.map(([label, value]) => (
          <div key={label} className="review-box-row">
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
