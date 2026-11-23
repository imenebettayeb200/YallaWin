import { Link, useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Panel from '../../components/common/Panel.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import BasicsSection from '../../components/create-event/BasicsSection.jsx';
import WhenWhereSection from '../../components/create-event/WhenWhereSection.jsx';
import TicketTiersSection from '../../components/create-event/TicketTiersSection.jsx';
import EventPreviewCard from '../../components/create-event/EventPreviewCard.jsx';
import PublishChecklist from '../../components/create-event/PublishChecklist.jsx';
import EventFormActions from '../../components/create-event/EventFormActions.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import useEventForm from '../../hooks/useEventForm.js';
import { eventSold, eventStatus, validateEventFields } from '../../models/index.js';
import { deleteEvent, saveEvent } from '../../services/eventService.js';

/** /org/events/:eventId -> same screen in edit mode (key resets the form per event). */
export function EditEventRoute() {
  const { eventId } = useParams();
  return <CreateEvent key={eventId} eventId={eventId} />;
}

export default function CreateEvent({ eventId = null }) {
  const { organization } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const { existing, form, errors, setErrors, formError, setFormError, checklist, update, updateTier, removeTier, addTier } = useEventForm(
    eventId,
    organization,
  );

  if (eventId && (!existing || existing.orgId !== organization.id)) {
    return (
      <div className="page">
        <PageHeader title="Event not found" />
        <Panel>
          <EmptyState
            title="This event doesn't exist"
            text="It may have been deleted."
            action={
              <Link to="/org/events" className="btn btn-outline">
                Back to events
              </Link>
            }
          />
        </Panel>
      </div>
    );
  }

  const status = existing ? eventStatus(existing) : 'draft';
  const isPublished = Boolean(existing && existing.status === 'published');
  const readOnly = status === 'ended';
  const hasSales = existing ? eventSold(existing) > 0 : false;

  const submit = (publish) => {
    const errs = validateEventFields(form, { publish });
    setErrors(errs);
    if (Object.keys(errs).length) {
      setFormError('Please fix the highlighted fields.');
      return;
    }
    if (publish && !checklist.every((c) => c.done)) {
      const missing = checklist.filter((c) => !c.done).map((c) => c.label.toLowerCase());
      setFormError(`Before publishing, complete: ${missing.join(', ')}.`);
      return;
    }
    try {
      saveEvent(organization.id, form, { publish });
      toast.show(publish ? (isPublished ? 'Changes saved.' : 'Event published 🎉') : 'Draft saved.');
      navigate(publish ? '/org/events?tab=upcoming' : '/org/events?tab=drafts');
    } catch (err) {
      setFormError(err.message);
    }
  };

  const handleDelete = () => {
    // eslint-disable-next-line no-alert
    if (!window.confirm(`Delete "${form.title || 'this draft'}"? This cannot be undone.`)) return;
    try {
      deleteEvent(organization.id, form.id);
      toast.show('Event deleted.');
      navigate('/org/events');
    } catch (err) {
      toast.show(err.message, 'error');
    }
  };

  const handleRemoveTier = (tier) => {
    if (tier.sold > 0) toast.show(`Can't remove "${tier.name}" — ${tier.sold} tickets already sold.`, 'error');
    else removeTier(tier.id);
  };

  return (
    <div className="page">
      <PageHeader
        title={existing ? (readOnly ? form.title : 'Edit event') : 'Create an event'}
        subtitle={readOnly ? 'This event has ended — details are read-only.' : 'Fill in the details — you can save a draft anytime.'}
      >
        <EventFormActions
          readOnly={readOnly}
          isPublished={isPublished}
          canDelete={Boolean(existing) && !hasSales}
          canSaveDraft={!isPublished}
          onDelete={handleDelete}
          onSaveDraft={() => submit(false)}
          onPublish={() => submit(true)}
        />
      </PageHeader>

      {formError && (
        <div className="form-alert page-alert" role="alert">
          {formError}
        </div>
      )}

      <div className="create-grid">
        <fieldset className="create-form" disabled={readOnly}>
          <BasicsSection form={form} errors={errors} update={update} readOnly={readOnly} onError={(m) => toast.show(m, 'error')} />
          <WhenWhereSection form={form} errors={errors} update={update} />
          <TicketTiersSection tiers={form.tiers} errors={errors} onChangeTier={updateTier} onRemoveTier={handleRemoveTier} onAddTier={addTier} />
        </fieldset>

        <aside className="preview-col">
          <EventPreviewCard event={form} />
          <PublishChecklist items={checklist} heading={existing ? <StatusBadge status={status} /> : 'Ready to publish?'} />
        </aside>
      </div>
    </div>
  );
}
