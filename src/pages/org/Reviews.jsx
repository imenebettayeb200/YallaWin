import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Panel from '../../components/common/Panel.jsx';
import PillTabs from '../../components/common/PillTabs.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import RatingSummary from '../../components/reviews/RatingSummary.jsx';
import MentionsPanel from '../../components/reviews/MentionsPanel.jsx';
import EventSelect from '../../components/reviews/EventSelect.jsx';
import ReviewItem from '../../components/reviews/ReviewItem.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import useReviewStats from '../../hooks/useReviewStats.js';
import { eventDisplayName } from '../../models/index.js';
import { replyToReview } from '../../services/eventService.js';

const PAGE = 10;
const TABS = [
  { key: 'all', label: 'All' },
  { key: 'needs-reply', label: 'Needs reply' },
  { key: 'low', label: 'Low ratings' },
];

export default function Reviews() {
  const { organization } = useAuth();
  const toast = useToast();
  const stats = useReviewStats(organization.id);
  const [params, setParams] = useSearchParams();
  const tab = TABS.some((t) => t.key === params.get('tab')) ? params.get('tab') : 'all';
  const [eventFilter, setEventFilter] = useState('all');
  const [limit, setLimit] = useState(PAGE);

  const filtered = stats.reviews.filter((r) => {
    if (tab === 'needs-reply' && r.reply) return false;
    if (tab === 'low' && r.rating > 2) return false;
    return eventFilter === 'all' || r.eventId === eventFilter;
  });
  const visible = filtered.slice(0, limit);

  const changeFilter = (setter) => (value) => {
    setter(value);
    setLimit(PAGE);
  };

  const handleReply = (reviewId, text) => {
    try {
      replyToReview(organization.id, reviewId, text);
      toast.show('Reply posted.');
      return true;
    } catch (err) {
      toast.show(err.message, 'error');
      return false;
    }
  };

  return (
    <div className="page">
      <PageHeader title="Reviews" subtitle="What attendees say about your events" />

      {stats.total === 0 ? (
        <Panel>
          <EmptyState icon="star" title="No reviews yet" text="Attendees can review your events after they end." />
        </Panel>
      ) : (
        <div className="reviews-top">
          <RatingSummary avg={stats.avg} total={stats.total} goAgain={stats.goAgain} distribution={stats.distribution} />
          <MentionsPanel tags={stats.tags} topEvents={stats.topEvents} selectedEvent={eventFilter} onSelectEvent={changeFilter(setEventFilter)} />
        </div>
      )}

      <div className="toolbar">
        <PillTabs tabs={TABS} value={tab} counts={stats.counts} onChange={changeFilter((key) => setParams(key === 'all' ? {} : { tab: key }, { replace: true }))} />
        <EventSelect value={eventFilter} options={stats.reviewedEvents} onChange={changeFilter(setEventFilter)} />
      </div>

      <div className="review-list">
        {visible.length === 0 && stats.total > 0 && (
          <Panel>
            <EmptyState icon="message" title="Nothing to show" text="No reviews match these filters." />
          </Panel>
        )}
        {visible.map((r) => (
          <ReviewItem
            key={r.id}
            review={r}
            eventName={eventDisplayName(stats.eventsById[r.eventId], stats.events)}
            orgName={organization.name}
            onReply={handleReply}
          />
        ))}
        {filtered.length > visible.length && (
          <button type="button" className="btn btn-outline load-more" onClick={() => setLimit((l) => l + PAGE)}>
            Load more ({filtered.length - visible.length} left)
          </button>
        )}
      </div>
    </div>
  );
}
