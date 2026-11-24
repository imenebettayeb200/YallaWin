import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { eventTabs } from "../../Data";
import { eventStart, eventStatus } from "../../utils";
import PageHeader from "../../components/layout/PageHeader";
import Panel from "../../components/common/Panel";
import PillTabs from "../../components/common/PillTabs";
import SearchInput from "../../components/common/SearchInput";
import Pagination from "../../components/common/Pagination";
import EmptyState from "../../components/common/EmptyState";
import Icon from "../../components/common/Icon";
import EventTable from "../../components/dashboard/EventTable";

const pageSize = 8;

/* Which tab an event belongs to. */
function tabOf(event) {
  const status = eventStatus(event);
  if (status === "draft") return "drafts";
  if (status === "ended") return "past";
  return "upcoming";
}

/* Events — /org/events. Table of all the organization's events with tabs, search and pages. */
function Events({ organization, events, notifications }) {
  const [tab, setTab] = useState("all");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    document.title = "Events · YallaWin";
    window.scrollTo(0, 0);
  }, []);

  /* Upcoming first (soonest first), then drafts, then past events (most recent first). */
  const order = { upcoming: 0, drafts: 1, past: 2 };
  const orgEvents = events
    .filter((e) => e.orgId === organization.id)
    .sort((a, b) => {
      if (tabOf(a) !== tabOf(b)) return order[tabOf(a)] - order[tabOf(b)];
      const timeA = a.date ? eventStart(a).getTime() : Infinity;
      const timeB = b.date ? eventStart(b).getTime() : Infinity;
      return tabOf(a) === "past" ? timeB - timeA : timeA - timeB;
    });

  const counts = { all: orgEvents.length, upcoming: 0, drafts: 0, past: 0 };
  orgEvents.forEach((e) => {
    counts[tabOf(e)] = counts[tabOf(e)] + 1;
  });

  const search = query.trim().toLowerCase();
  const filtered = orgEvents
    .filter((e) => tab === "all" || tabOf(e) === tab)
    .filter((e) => !search || (e.title + " " + e.category + " " + e.venue).toLowerCase().includes(search));

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const visible = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const changeTab = (key) => {
    setTab(key);
    setPage(1);
  };

  const changeQuery = (value) => {
    setQuery(value);
    setPage(1);
  };

  return (
    <div className="page">
      <PageHeader
        title="Events"
        subtitle={counts.all + " events · " + counts.upcoming + " upcoming"}
        notifications={notifications}
        showCreate
      ></PageHeader>
      <div className="toolbar">
        <PillTabs tabs={eventTabs} value={tab} counts={counts} onChange={changeTab}></PillTabs>
        <SearchInput placeholder="Search events" value={query} onChange={changeQuery}></SearchInput>
      </div>
      <Panel className="table-panel">
        {visible.length === 0 ? (
          <EmptyState
            title={query ? "No events match your search" : "Nothing here yet"}
            text={query ? "Try another name, category or venue." : "Events you create will show up here."}
            action={
              !query && (
                <Link to="/org/events/new" className="btn btn-gradient">
                  Create event <Icon name="plus" size={16}></Icon>
                </Link>
              )
            }
          ></EmptyState>
        ) : (
          <EventTable events={visible} orgName={organization.name} linkPrefix="/org/events/"></EventTable>
        )}
        <Pagination
          page={currentPage}
          pageCount={pageCount}
          onChange={setPage}
          shown={visible.length}
          total={filtered.length}
        ></Pagination>
      </Panel>
    </div>
  );
}

export default Events;
