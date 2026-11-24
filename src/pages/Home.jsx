import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  cityOf,
  eventCapacity,
  eventSold,
  eventStart,
  isUpcoming,
  minPrice,
  spotsLeft,
  toDate,
  todayIso,
} from "../utils";
import Background from "../components/layout/Background";
import Navbar from "../components/layout/Navbar";
import HomeHero from "../components/home/HomeHero";
import TopPicksCarousel from "../components/home/TopPicksCarousel";
import WeekendList from "../components/home/WeekendList";
import EventFilters from "../components/home/EventFilters";
import EventGrid from "../components/home/EventGrid";

const defaultFilters = { category: "all", freeOnly: false, city: "all", sort: "soon" };

/* How to sort the list for each "Sort" option. */
function sortEvents(list, sort) {
  const copy = [...list];
  if (sort === "popular") return copy.sort((a, b) => eventSold(b) - eventSold(a));
  if (sort === "price-asc") return copy.sort((a, b) => minPrice(a) - minPrice(b));
  if (sort === "price-desc") return copy.sort((a, b) => minPrice(b) - minPrice(a));
  return copy.sort((a, b) => eventStart(a) - eventStart(b));
}

/*
 * Home — "/". Welcome title, top picks carousel, "This weekend" (phones),
 * and "All events" with search, category chips, Free, City and Sort.
 */
function Home({ user, users, organizations, events, onLogout, onToggleLike }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState(defaultFilters);

  useEffect(() => {
    document.title = "Discover events · YallaWin";
    window.scrollTo(0, 0);
  }, []);

  const upcoming = events.filter((e) => e.status === "published" && isUpcoming(e));

  /* Top picks: events matching the user's interests first, then the most popular. */
  const interests = user ? user.interests : [];
  const topPicks = upcoming
    .filter((e) => spotsLeft(e) > 0)
    .sort((a, b) => {
      const aLiked = interests.includes(a.category) ? 1 : 0;
      const bLiked = interests.includes(b.category) ? 1 : 0;
      if (aLiked !== bLiked) return bLiked - aLiked;
      return eventSold(b) / eventCapacity(b) - eventSold(a) / eventCapacity(a);
    })
    .slice(0, 5);

  /* "This weekend": events from today until next Sunday. */
  const today = toDate(todayIso());
  const sunday = new Date(today);
  sunday.setDate(today.getDate() + ((7 - today.getDay()) % 7) + 1);
  const weekend = sortEvents(upcoming, "soon")
    .filter((e) => eventStart(e) < sunday)
    .slice(0, 6);

  /* City dropdown: every city that has an event. */
  const cityNames = [];
  upcoming.forEach((e) => {
    const city = cityOf(e.venue);
    if (city && !cityNames.includes(city)) cityNames.push(city);
  });
  const cities = [{ key: "all", label: "All cities" }, ...cityNames.sort().map((city) => ({ key: city, label: city }))];

  const text = search.trim().toLowerCase();
  const filtered = sortEvents(
    upcoming.filter((e) => {
      if (filters.category !== "all" && e.category !== filters.category) return false;
      if (filters.freeOnly && minPrice(e) !== 0) return false;
      if (filters.city !== "all" && cityOf(e.venue) !== filters.city) return false;
      return !text || (e.title + " " + e.venue + " " + e.category).toLowerCase().includes(text);
    }),
    filters.sort,
  );

  /* Visitors must sign in before liking an event. */
  const like = (eventId) => {
    if (!user) navigate("/login");
    else onToggleLike(eventId);
  };

  return (
    <div className="home-page">
      <Background></Background>
      <Navbar user={user} onLogout={onLogout} search={search} onSearch={setSearch}></Navbar>

      <HomeHero user={user} liveCount={upcoming.length}>
        <TopPicksCarousel events={topPicks} organizations={organizations} users={users}></TopPicksCarousel>
      </HomeHero>

      <WeekendList events={weekend}></WeekendList>

      <section className="all-events" id="all-events">
        <h2>All events</h2>
        <EventFilters filters={filters} onChange={setFilters} cities={cities}></EventFilters>
        <EventGrid events={filtered} likes={user ? user.likes : []} onToggleLike={like}></EventGrid>
      </section>
    </div>
  );
}

export default Home;
