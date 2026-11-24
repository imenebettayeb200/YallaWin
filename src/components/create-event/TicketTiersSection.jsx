import Icon from "../common/Icon";
import Panel from "../common/Panel";
import TicketTierRow from "./TicketTierRow";

function TicketTiersSection({ tiers, errors, onChangeTier, onRemoveTier, onAddTier }) {
  return (
    <Panel className="form-panel">
      <h2 className="panel-title">Tickets &amp; capacity</h2>
      {tiers.length === 0 && <p className="muted small">No ticket tiers yet.</p>}
      {errors.tiersEmpty && <p className="field-error">{errors.tiersEmpty}</p>}
      <div className="tiers">
        {tiers.map((t) => (
          <TicketTierRow
            key={t.id}
            tier={t}
            error={errors.tiers && errors.tiers[t.id]}
            onChange={(patch) => onChangeTier(t.id, patch)}
            onRemove={() => onRemoveTier(t)}
          />
        ))}
      </div>
      <button type="button" className="add-tier" onClick={onAddTier}>
        Add ticket tier <Icon name="plus" size={14} />
      </button>
    </Panel>
  );
}

export default TicketTiersSection;
