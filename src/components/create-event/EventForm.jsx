import { useState } from "react";
import { categories } from "../../Data";
import { eventSold, eventStart, eventStatus, isFreeEvent, makeId, todayIso } from "../../utils";
import StatusBadge from "../common/StatusBadge";
import BasicsSection from "./BasicsSection";
import WhenWhereSection from "./WhenWhereSection";
import TicketTiersSection from "./TicketTiersSection";
import EventPreviewCard from "./EventPreviewCard";
import PublishChecklist from "./PublishChecklist";
import EventFormActions from "./EventFormActions";

/* A new empty event for this host ({ orgId } or { hostUserId }). */
function newEvent(host) {
  return {
    id: makeId("evt"),
    orgId: host.orgId || null,
    hostUserId: host.hostUserId || null,
    title: "",
    category: "Workshop",
    description: "",
    image: "",
    date: "",
    startTime: "18:00",
    endTime: "21:00",
    venue: "",
    address: "",
    lineup: [],
    tiers: [{ id: makeId("tier"), name: "General", description: "", price: 30, quantity: 50, sold: 0 }],
    status: "draft",
    createdAt: todayIso(),
  };
}

/* Checks the fields. Returns { field: message } (empty = everything is fine). */
function checkFields(form, publish) {
  const errors = {};
  if (form.title.trim().length < 3) errors.title = "Give your event a title (at least 3 characters).";
  if (form.title.trim().length > 80) errors.title = "Keep the title under 80 characters.";
  if (form.description.length > 1000) errors.description = "Keep the description under 1000 characters.";
  if (publish) {
    if (!form.date) errors.date = "Pick a date.";
    else if (eventStart(form) < new Date()) errors.date = "The event must start in the future.";
    if (!form.startTime) errors.startTime = "Pick a start time.";
    if (!form.endTime) errors.endTime = "Pick an end time.";
    if (form.startTime && form.startTime === form.endTime) errors.endTime = "End time must differ from start time.";
    if (form.venue.trim().length < 3) errors.venue = "Add a venue.";
    if (form.tiers.length === 0) errors.tiersEmpty = "Add at least one ticket tier.";
  }
  const tierErrors = {};
  form.tiers.forEach((tier) => {
    if (!tier.name.trim()) tierErrors[tier.id] = "Name this tier.";
    else if (tier.price === "" || Number(tier.price) < 0) tierErrors[tier.id] = "Price must be 0 or more.";
    else if (tier.quantity === "" || Number(tier.quantity) < 1) tierErrors[tier.id] = "Quantity must be at least 1.";
    else if (Number(tier.quantity) < tier.sold)
      tierErrors[tier.id] = tier.sold + " already sold, the quantity can't be lower.";
  });
  if (Object.keys(tierErrors).length > 0) errors.tiers = tierErrors;
  return errors;
}

/*
 * EventForm — the whole "Create / Edit event" screen, used by organizations (/org/events/new)
 * and by users who host their own event (/my-events/new).
 *  existing  the event to edit, or null to create a new one
 *  host      { orgId } or { hostUserId }
 *  verified  true when the organization is verified / the user's phone is verified
 *  onSave(event, publish) and onDelete(id) come from App; onDone() is called after saving.
 */
function EventForm({
  existing,
  host,
  verified,
  verifyLabel,
  verifyLink,
  title,
  headerExtra,
  onSave,
  onDelete,
  onDone,
  showToast,
}) {
  const [form, setForm] = useState(existing ? existing : newEvent(host));
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");

  const status = existing ? eventStatus(existing) : "draft";
  const isPublished = Boolean(existing && existing.status === "published");
  const readOnly = status === "ended";
  const hasSales = existing ? eventSold(existing) > 0 : false;

  /* Users only need a verified phone for paid events. Organizations always need to be verified. */
  const verifyNeeded = host.orgId ? true : !isFreeEvent(form);
  const checklist = [
    { key: "cover", label: "Cover image (optional)", done: Boolean(form.image), optional: true },
    {
      key: "title",
      label: "Title & category",
      done: form.title.trim().length >= 3 && categories.includes(form.category),
    },
    {
      key: "when",
      label: "Date, time & venue",
      done: Boolean(form.date && form.startTime && form.endTime) && form.venue.trim().length >= 3,
    },
    {
      key: "tiers",
      label: "At least one ticket tier",
      done: form.tiers.length > 0 && form.tiers.every((t) => t.name.trim() && Number(t.quantity) > 0),
    },
    { key: "verified", label: verifyLabel, done: verified || !verifyNeeded, link: verifyLink },
  ];

  const update = (changes) => {
    setForm({ ...form, ...changes });
    setFormError("");
  };

  const updateTier = (tierId, changes) => {
    setForm({ ...form, tiers: form.tiers.map((t) => (t.id === tierId ? { ...t, ...changes } : t)) });
  };

  const addTier = () => {
    const tier = {
      id: makeId("tier"),
      name: "Tier " + (form.tiers.length + 1),
      description: "",
      price: 30,
      quantity: 10,
      sold: 0,
    };
    setForm({ ...form, tiers: [...form.tiers, tier] });
  };

  const removeTier = (tier) => {
    if (tier.sold > 0) {
      showToast("Can't remove " + tier.name + ": " + tier.sold + " tickets already sold.", "error");
      return;
    }
    setForm({ ...form, tiers: form.tiers.filter((t) => t.id !== tier.id) });
  };

  const submit = (publish) => {
    const found = checkFields(form, publish);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      setFormError("Please fix the highlighted fields.");
      return;
    }
    const missing = checklist.filter((item) => !item.done && !item.optional);
    if (publish && missing.length > 0) {
      setFormError("Before publishing, complete: " + missing.map((item) => item.label.toLowerCase()).join(", ") + ".");
      return;
    }
    onSave(form, publish);
    onDone(publish);
  };

  const remove = () => {
    if (window.confirm('Delete "' + (form.title || "this draft") + '"? This cannot be undone.')) {
      onDelete(form.id);
      onDone(false);
    }
  };

  let pageTitle = title;
  if (existing) pageTitle = readOnly ? form.title : "Edit event";

  return (
    <>
      <header className="page-header">
        <div>
          <h1 className="page-title">{pageTitle}</h1>
          <p className="page-subtitle">
            {readOnly
              ? "This event has ended, details are read-only."
              : "Fill in the details, you can save a draft anytime."}
          </p>
        </div>
        <div className="page-actions">
          {headerExtra}
          <EventFormActions
            readOnly={readOnly}
            isPublished={isPublished}
            canDelete={Boolean(existing) && !hasSales}
            canSaveDraft={!isPublished}
            onDelete={remove}
            onSaveDraft={() => submit(false)}
            onPublish={() => submit(true)}
          ></EventFormActions>
        </div>
      </header>

      {formError && <div className="form-alert page-alert">{formError}</div>}

      <div className="create-grid">
        <fieldset className="create-form" disabled={readOnly}>
          <BasicsSection
            form={form}
            errors={errors}
            update={update}
            readOnly={readOnly}
            onError={(message) => showToast(message, "error")}
          ></BasicsSection>
          <WhenWhereSection form={form} errors={errors} update={update}></WhenWhereSection>
          <TicketTiersSection
            tiers={form.tiers}
            errors={errors}
            onChangeTier={updateTier}
            onRemoveTier={removeTier}
            onAddTier={addTier}
          ></TicketTiersSection>
        </fieldset>
        <aside className="preview-col">
          <EventPreviewCard event={form}></EventPreviewCard>
          <PublishChecklist
            items={checklist}
            heading={existing ? <StatusBadge status={status}></StatusBadge> : "Ready to publish?"}
          ></PublishChecklist>
        </aside>
      </div>
    </>
  );
}

export default EventForm;
