import { useState } from 'react';
import Panel from '../common/Panel.jsx';
import TextField from '../auth/TextField.jsx';
import { isValidEmail } from '../../models/index.js';

/** Organization profile + payout bank details. onSave(values) may throw. */
export default function ProfileForm({ organization, onSave, onError }) {
  const [values, setValues] = useState({
    name: organization.name,
    city: organization.city,
    bio: organization.bio,
    contactEmail: organization.contactEmail,
    holder: organization.payoutMethod ? organization.payoutMethod.holder : '',
    bank: organization.payoutMethod ? organization.payoutMethod.bank : '',
  });
  const set = (key) => (e) => setValues((v) => ({ ...v, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (values.name.trim().length < 2) return onError('Organization name is too short.');
    if (values.contactEmail && !isValidEmail(values.contactEmail)) return onError('Contact email is not valid.');
    return onSave(values);
  };

  return (
    <Panel as="form" className="form-panel" onSubmit={handleSubmit}>
      <h2 className="panel-title">Organization profile</h2>
      <TextField label="Name" value={values.name} onChange={set('name')} />
      <TextField label="City" value={values.city} onChange={set('city')} />
      <TextField label="Contact email" type="email" value={values.contactEmail} onChange={set('contactEmail')} />
      <label className="field">
        <span className="field-label">About</span>
        <textarea className="input textarea" rows={3} value={values.bio} onChange={set('bio')} />
      </label>
      <h2 className="panel-title spaced">Payout method</h2>
      <TextField label="Account holder" value={values.holder} onChange={set('holder')} />
      <TextField label="Bank" placeholder="BIAT, STB, Attijari…" value={values.bank} onChange={set('bank')} />
      <button type="submit" className="btn btn-white">
        Save changes
      </button>
    </Panel>
  );
}
