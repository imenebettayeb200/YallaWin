import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import HomeBackground from '../../components/home/HomeBackground.jsx';
import HomeNav, { HOME_TABS } from '../../components/home/HomeNav.jsx';
import HomeHero from '../../components/home/HomeHero.jsx';
import TopPicksCarousel from '../../components/home/TopPicksCarousel.jsx';
import EventFilters from '../../components/home/EventFilters.jsx';
import EventGrid from '../../components/home/EventGrid.jsx';
import GoingToSection from '../../components/home/GoingToSection.jsx';
import MyEventsSection from '../../components/home/MyEventsSection.jsx';
import EventModal from '../../components/home/EventModal.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { db } from '../../data/db.js';
import useHomeEvents from '../../hooks/useHomeEvents.js';
import useDebounce from '../../hooks/useDebounce.js';
import useLocalStorageState from '../../hooks/useLocalStorageState.js';
import usePageTitle from '../../hooks/usePageTitle.js';
import { DEFAULT_HOME_FILTERS } from '../../data/data.js';
import { addReview } from '../../services/eventService.js';

export default function Home() {
  const { user, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const tab = HOME_TABS.some((t) => t.key === params.get('tab')) ? params.get('tab') : 'home';

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 250); // filter after the user pauses typing
  const [filters, setFilters] = useLocalStorageState('yw_home_filters', DEFAULT_HOME_FILTERS); // remembered after refresh
  const [openEventId, setOpenEventId] = useState(null);

  const userId = user ? user.id : null;
  const { orgNames, topPicks, cities, filtered, tickets, myReviews, allEvents } = useHomeEvents({ ...filters, search: debouncedSearch, userId });

  usePageTitle(tab === 'going' ? 'Going to' : tab === 'mine' ? 'My events' : 'Discover events');

  // If a remembered city no longer has events, go back to "All cities".
  useEffect(() => {
    if (filters.city !== 'all' && !cities.some((c) => c.key === filters.city)) {
      setFilters((f) => ({ ...f, city: 'all' }));
    }
  }, [cities, filters.city, setFilters]);

  const favorites = user ? user.favorites : null;
  const saved = useMemo(() => new Set(favorites || []), [favorites]);
  const savedEvents = allEvents.filter((e) => saved.has(e.id) && e.status === 'published');
  const openEvent = allEvents.find((e) => e.id === openEventId) || null;

  const goToLogin = (from) => navigate('/login', { state: { from } });
  const openModal = (event) => setOpenEventId(event.id);
  const closeModal = useCallback(() => setOpenEventId(null), []);

  const setTab = (key) => {
    if (key !== 'home' && !user) return goToLogin(`/?tab=${key}`);
    return setParams(key === 'home' ? {} : { tab: key }, { replace: true });
  };

  const handleSearch = (value) => {
    setSearch(value);
    if (tab !== 'home') setTab('home');
  };

  const toggleSave = (eventId) => {
    if (!user) return goToLogin('/');
    const next = new Set(user.favorites || []);
    if (next.has(eventId)) next.delete(eventId);
    else next.add(eventId);
    return db.update('users', user.id, { favorites: [...next] });
  };

  const handleReview = (event, rating, text) => {
    try {
      addReview({ eventId: event.id, user, rating, text });
      toast.show('Thanks for your review!');
    } catch (err) {
      toast.show(err.message, 'error');
    }
  };

  const handleLogout = () => {
    logout();
    setParams({}, { replace: true });
  };

  return (
    <div className="home-page">
      <HomeBackground />
      <HomeNav tab={tab} onTabChange={setTab} search={search} onSearch={handleSearch} user={user} onLogout={handleLogout} />

      {tab === 'home' && (
        <>
          <HomeHero user={user}>
            <TopPicksCarousel events={topPicks} orgNames={orgNames} onOpen={openModal} />
          </HomeHero>
          <section className="all-events">
            <h2>All events</h2>
            <EventFilters filters={filters} onChange={setFilters} cities={cities} />
            <EventGrid events={filtered} saved={saved} onToggleSave={toggleSave} onOpen={openModal} />
          </section>
        </>
      )}

      {tab === 'going' && user && <GoingToSection tickets={tickets.goingTo} onOpen={openModal} onBrowse={() => setTab('home')} />}

      {tab === 'mine' && user && (
        <MyEventsSection
          savedEvents={savedEvents}
          saved={saved}
          attended={tickets.attended}
          myReviews={myReviews}
          onToggleSave={toggleSave}
          onOpen={openModal}
          onReview={handleReview}
        />
      )}

      {openEvent && <EventModal event={openEvent} orgName={orgNames[openEvent.orgId]} user={user} onClose={closeModal} />}
    </div>
  );
}