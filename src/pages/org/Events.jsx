import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Panel from '../../components/common/Panel.jsx';
import PillTabs from '../../components/common/PillTabs.jsx';
import SearchInput from '../../components/common/SearchInput.jsx';
import Pagination from '../../components/common/Pagination.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import Icon from '../../components/common/Icon.jsx';
import EventTable from '../../components/dashboard/EventTable.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import useOrgEventList, { EVENT_TABS } from '../../hooks/useOrgEventList.js';

const PAGE_SIZE = 8;

export default function Events() {
  const { organization } = useAuth();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const searchRef = useRef(null);
  const tab = EVENT_TABS.some((t) => t.key === params.get('tab')) ? params.get('tab') : 'all';
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const { events, counts } = useOrgEventList(organization.id, tab, query);

  useEffect(() => {
    if (params.get('focus') === 'search' && searchRef.current) searchRef.current.focus();
  }, [params]);

  const pageCount = Math.max(1, Math.ceil(events.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const visible = events.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const changeTab = (key) => {
    setParams(key === 'all' ? {} : { tab: key }, { replace: true });
    setPage(1);
  };

  return (
    <div className="page">
      <PageHeader title="Events" subtitle={`${counts.all} events · ${counts.upcoming} upcoming`} showCreate />

      <div className="toolbar">
        <PillTabs tabs={EVENT_TABS} value={tab} counts={counts} onChange={changeTab} />
        <SearchInput
          inputRef={searchRef}
          placeholder="Search events"
          value={query}
          onChange={(v) => {
            setQuery(v);
            setPage(1);
          }}
        />
      </div>

      <Panel className="table-panel">
        {visible.length === 0 ? (
          <EmptyState
            title={query ? 'No events match your search' : 'Nothing here yet'}
            text={query ? 'Try another name, category or venue.' : 'Events you create will show up here.'}
            action={
              !query && (
                <Link to="/org/events/new" className="btn btn-gradient">
                  Create event <Icon name="plus" size={16} />
                </Link>
              )
            }
          />
        ) : (
          <EventTable events={visible} orgName={organization.name} onOpen={(id) => navigate(`/org/events/${id}`)} />
        )}
        <Pagination page={currentPage} pageCount={pageCount} onChange={setPage} shown={visible.length} total={events.length} />
      </Panel>
    </div>
  );
}
