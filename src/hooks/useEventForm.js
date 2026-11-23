import { useMemo, useState } from 'react';
import { db } from '../data/db.js';
import { createEvent, createTicketTier, getPublishChecklist } from '../models/index.js';

/** State + updaters for the create / edit event form. */
export default function useEventForm(eventId, organization) {
  const existing = useMemo(() => (eventId ? db.findById('events', eventId) : null), [eventId]);
  const [form, setForm] = useState(() =>
    existing ? JSON.parse(JSON.stringify(existing)) : createEvent({ orgId: organization.id }),
  );
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');

  const checklist = useMemo(() => getPublishChecklist(form, organization), [form, organization]);

  const update = (patch) => {
    setForm((f) => ({ ...f, ...patch }));
    setFormError('');
  };

  const updateTier = (id, patch) => setForm((f) => ({ ...f, tiers: f.tiers.map((t) => (t.id === id ? { ...t, ...patch } : t)) }));

  const removeTier = (id) => setForm((f) => ({ ...f, tiers: f.tiers.filter((t) => t.id !== id) }));

  const addTier = () =>
    setForm((f) => ({ ...f, tiers: [...f.tiers, createTicketTier({ name: `Tier ${f.tiers.length + 1}`, price: 30, quantity: 10 })] }));

  return { existing, form, errors, setErrors, formError, setFormError, checklist, update, updateTier, removeTier, addTier };
}
