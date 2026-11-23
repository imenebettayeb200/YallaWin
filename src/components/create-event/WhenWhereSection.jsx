import Panel from '../common/Panel.jsx';
import IconField from './IconField.jsx';

export default function WhenWhereSection({ form, errors, update }) {
  return (
    <Panel className="form-panel">
      <h2 className="panel-title">When &amp; where</h2>
      <div className="when-grid">
        <IconField label="Date" icon="calendar" type="date" value={form.date} error={errors.date} onChange={(e) => update({ date: e.target.value })} />
        <IconField label="Start" icon="clock" type="time" value={form.startTime} error={errors.startTime} onChange={(e) => update({ startTime: e.target.value })} />
        <IconField label="End" icon="clock" type="time" value={form.endTime} error={errors.endTime} onChange={(e) => update({ endTime: e.target.value })} />
      </div>
      <IconField
        label="Venue"
        icon="pin"
        value={form.venue}
        placeholder="Foll'Amour terrace, Gammarth"
        error={errors.venue}
        onChange={(e) => update({ venue: e.target.value })}
      />
    </Panel>
  );
}
