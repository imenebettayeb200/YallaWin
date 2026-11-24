import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import * as Data from "./Data";
import {
  eventStatus,
  isValidEmail,
  makeCode,
  makeId,
  makeTicketNumber,
  passwordError,
  shortName,
  todayIso,
} from "./utils";
import Toast from "./components/common/Toast";
import DashboardLayout from "./components/layout/DashboardLayout";
import Home from "./pages/Home";
import EventDetails from "./pages/EventDetails";
import Checkout from "./pages/Checkout";
import BookingConfirmed from "./pages/BookingConfirmed";
import GoingTo from "./pages/GoingTo";
import MyEvents from "./pages/MyEvents";
import HostEvent from "./pages/HostEvent";
import Profile from "./pages/Profile";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import TwoStepVerification from "./pages/auth/TwoStepVerification";
import OrgLogin from "./pages/org-auth/OrgLogin";
import OrgForgotPassword from "./pages/org-auth/OrgForgotPassword";
import ApplyOrganization from "./pages/org-auth/ApplyOrganization";
import ApplicationSubmitted from "./pages/org-auth/ApplicationSubmitted";
import Overview from "./pages/org/Overview";
import Events from "./pages/org/Events";
import CreateEvent from "./pages/org/CreateEvent";
import Reviews from "./pages/org/Reviews";
import Payouts from "./pages/org/Payouts";
import Settings from "./pages/org/Settings";
import NotFound from "./pages/NotFound";

/*
 * App — the "brain" of YallaWin.
 *  - keeps ALL the data in useState (users, events, tickets, reviews...)
 *  - has every function that changes the data (book a ticket, post a review...)
 *  - gives the data and the functions to the pages with props
 *  - lists all the routes (pages) of the website
 *
 * The first values come from Data.js. A useEffect saves every change in the
 * browser (localStorage) so a refresh does not lose your bookings.
 * To connect a database later: load the lists with fetch() in a useEffect and
 * send each change to the API inside the functions below.
 */

const STORAGE_KEY = "yallawin-data-v3";

/* Reads what was saved in the browser the last time (or null). */
function loadSaved() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY));
  } catch {
    return null;
  }
}
const saved = loadSaved() || {};

function App() {
  /* ----------------------------- data ----------------------------- */
  const [users, setUsers] = useState(saved.users || Data.users);
  const [organizations, setOrganizations] = useState(saved.organizations || Data.organizations);
  const [events, setEvents] = useState(saved.events || Data.events);
  const [tickets, setTickets] = useState(saved.tickets || Data.tickets);
  const [reviews, setReviews] = useState(saved.reviews || Data.reviews);
  const [payouts, setPayouts] = useState(saved.payouts || Data.payouts);
  const [currentUserId, setCurrentUserId] = useState(saved.currentUserId || null);

  /* Sign-in waiting for the 6-digit code, and password reset in progress. */
  const [pendingLogin, setPendingLogin] = useState(null);
  const [resetRequest, setResetRequest] = useState(null);

  /* Small message at the bottom of the screen ("Review posted"...). */
  const [toast, setToast] = useState(null);

  /* Save everything in the browser after each change. */
  useEffect(() => {
    const data = { users, organizations, events, tickets, reviews, payouts, currentUserId };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [users, organizations, events, tickets, reviews, payouts, currentUserId]);

  const user = users.find((u) => u.id === currentUserId) || null;
  const organization = user && user.orgId ? organizations.find((o) => o.id === user.orgId) || null : null;

  const showToast = (text, type) => {
    setToast({ text: text, type: type || "success", id: Date.now() });
  };

  /* ------------------------- accounts ------------------------- */

  /* Step 1 of sign in. identifier = email (or OrganizationID when asOrg). Returns an error or "". */
  const login = (identifier, password, asOrg) => {
    const value = identifier.trim().toLowerCase();
    let found = null;
    if (asOrg) {
      const org = organizations.find(
        (o) => (o.organizationId || "").toLowerCase() === value || o.contactEmail.toLowerCase() === value,
      );
      found = org ? users.find((u) => u.id === org.ownerId) : null;
      if (org && org.status === "pending") {
        return "Your application is still under review. We will email your OrganizationID once it is approved.";
      }
    } else {
      found = users.find((u) => u.email === value);
    }
    if (!found || found.password !== password) {
      return asOrg ? "Incorrect OrganizationID or password." : "Incorrect email or password.";
    }
    setPendingLogin({ userId: found.id, email: found.email, role: found.role, code: makeCode() });
    return "";
  };

  /* Step 2 of sign in: check the 6-digit code. Returns an error or "". */
  const verifyCode = (code) => {
    if (!pendingLogin) return "Your sign-in expired. Please sign in again.";
    if (code !== pendingLogin.code) return "Incorrect code. Check the demo inbox and try again.";
    setCurrentUserId(pendingLogin.userId);
    setPendingLogin(null);
    showToast("Welcome back!");
    return "";
  };

  const resendCode = () => {
    if (pendingLogin) setPendingLogin({ ...pendingLogin, code: makeCode() });
  };

  const cancelLogin = () => {
    setPendingLogin(null);
  };

  const logout = () => {
    setCurrentUserId(null);
    showToast("You are signed out.");
  };

  /* Creates an attendee account and signs in. Returns an error or "". */
  const register = (form) => {
    const email = form.email.trim().toLowerCase();
    if (users.some((u) => u.email === email)) return "An account with this email already exists.";
    const newUser = {
      id: makeId("usr"),
      role: "user",
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: email,
      password: form.password,
      phone: "",
      phoneVerified: false,
      interests: form.interests,
      likes: [],
      orgId: null,
      createdAt: todayIso(),
    };
    setUsers([...users, newUser]);
    setCurrentUserId(newUser.id);
    showToast("Welcome to YallaWin, " + newUser.firstName + "!");
    return "";
  };

  const updateUser = (userId, changes) => {
    setUsers(users.map((u) => (u.id === userId ? { ...u, ...changes } : u)));
  };

  /* Returns an error or "". */
  const changePassword = (currentPassword, newPassword) => {
    if (!user) return "You are signed out.";
    if (user.password !== currentPassword) return "Current password is incorrect.";
    const problem = passwordError(newPassword);
    if (problem) return problem;
    updateUser(user.id, { password: newPassword });
    return "";
  };

  /* Forgot password, step 1. identifier = email or OrganizationID. Returns { error, email }. */
  const requestReset = (identifier) => {
    const value = identifier.trim().toLowerCase();
    let found = null;
    if (value.includes("@")) {
      if (!isValidEmail(value)) return { error: "Enter a valid email address.", email: "" };
      found = users.find((u) => u.email === value);
    } else {
      if (!value) return { error: "Enter your OrganizationID or admin email.", email: "" };
      const org = organizations.find((o) => (o.organizationId || "").toLowerCase() === value);
      found = org ? users.find((u) => u.id === org.ownerId) : null;
    }
    if (!found) {
      setResetRequest(null);
      return { error: "", email: value.includes("@") ? value : "" };
    }
    setResetRequest({ userId: found.id, email: found.email, code: makeCode() });
    return { error: "", email: found.email };
  };

  const resendResetCode = () => {
    if (resetRequest) setResetRequest({ ...resetRequest, code: makeCode() });
  };

  /* Forgot password, step 2. Returns an error or "". */
  const confirmReset = (code, newPassword) => {
    if (!resetRequest) return "This code has expired. Ask for a new one.";
    if (code !== resetRequest.code) return "Incorrect code.";
    const problem = passwordError(newPassword);
    if (problem) return problem;
    updateUser(resetRequest.userId, { password: newPassword });
    setResetRequest(null);
    showToast("Password updated, you can sign in now.");
    return "";
  };

  /* -------------------------- events -------------------------- */

  /* Heart button: add or remove the event from the user's liked list. */
  const toggleLike = (eventId) => {
    if (!user) return;
    const likes = user.likes.includes(eventId) ? user.likes.filter((id) => id !== eventId) : [...user.likes, eventId];
    updateUser(user.id, { likes: likes });
  };

  /* Creates or updates an event. publish: true = visible on the home page. */
  const saveEvent = (event, publish) => {
    const exists = events.some((e) => e.id === event.id);
    const status = publish || event.status === "published" ? "published" : "draft";
    const clean = {
      ...event,
      title: event.title.trim(),
      description: event.description.trim(),
      venue: event.venue.trim(),
      address: event.address.trim(),
      tiers: event.tiers.map((tier) => ({
        ...tier,
        name: tier.name.trim(),
        price: Math.max(0, Number(tier.price) || 0),
        quantity: Math.max(1, Math.floor(Number(tier.quantity) || 1)),
      })),
      status: status,
    };
    if (exists) setEvents(events.map((e) => (e.id === event.id ? clean : e)));
    else setEvents([...events, clean]);
    showToast(publish ? "Event published 🎉" : "Draft saved.");
  };

  const deleteEvent = (eventId) => {
    setEvents(events.filter((e) => e.id !== eventId));
    showToast("Event deleted.");
  };

  /* -------------------------- tickets -------------------------- */

  /* Books tickets: saves the ticket and adds the quantity to the sold count. Returns the ticket. */
  const bookTickets = (booking) => {
    const event = events.find((e) => e.id === booking.eventId);
    const tier = event.tiers.find((t) => t.id === booking.tierId);
    const fee = tier.price > 0 ? Data.serviceFeePerTicket * booking.qty : 0;
    const ticket = {
      id: makeTicketNumber(),
      userId: user.id,
      eventId: event.id,
      tierId: tier.id,
      qty: booking.qty,
      price: tier.price,
      fee: fee,
      total: tier.price * booking.qty + fee,
      payment: booking.payment,
      name: booking.name,
      email: booking.email,
      phone: booking.phone,
      status: "confirmed",
      date: todayIso(),
    };
    setTickets([...tickets, ticket]);
    setEvents(
      events.map((e) =>
        e.id === event.id
          ? { ...e, tiers: e.tiers.map((t) => (t.id === tier.id ? { ...t, sold: t.sold + booking.qty } : t)) }
          : e,
      ),
    );
    return ticket;
  };

  /* Cancels a booking and gives the spots back. */
  const cancelBooking = (ticketId) => {
    const ticket = tickets.find((t) => t.id === ticketId);
    setTickets(tickets.map((t) => (t.id === ticketId ? { ...t, status: "cancelled" } : t)));
    setEvents(
      events.map((e) =>
        e.id === ticket.eventId
          ? {
              ...e,
              tiers: e.tiers.map((t) =>
                t.id === ticket.tierId ? { ...t, sold: Math.max(0, t.sold - ticket.qty) } : t,
              ),
            }
          : e,
      ),
    );
    showToast("Booking cancelled. You will be refunded in 3 to 5 days.");
  };

  /* -------------------------- reviews -------------------------- */

  const addReview = (eventId, rating, tags, text) => {
    const review = {
      id: makeId("rev"),
      eventId: eventId,
      userId: user.id,
      authorName: shortName(user),
      rating: rating,
      tags: tags,
      text: text.trim(),
      reply: null,
      date: todayIso(),
    };
    setReviews([review, ...reviews]);
    showToast("Thanks for your review!");
  };

  const replyToReview = (reviewId, text) => {
    setReviews(reviews.map((r) => (r.id === reviewId ? { ...r, reply: { text: text.trim(), date: todayIso() } } : r)));
    showToast("Reply posted.");
  };

  /* ----------------------- organizations ----------------------- */

  const updateOrganization = (orgId, changes) => {
    setOrganizations(organizations.map((o) => (o.id === orgId ? { ...o, ...changes } : o)));
  };

  /* "Apply to get verified": creates the admin account + the organization (status "pending"). */
  const applyOrganization = (info, documents) => {
    const userId = makeId("usr");
    const orgId = makeId("org");
    const admin = {
      id: userId,
      role: "org",
      firstName: info.name.trim(),
      lastName: "",
      email: info.adminEmail.trim().toLowerCase(),
      password: info.password,
      phone: "",
      phoneVerified: true,
      interests: [],
      likes: [],
      orgId: orgId,
      createdAt: todayIso(),
    };
    const org = {
      id: orgId,
      organizationId: null,
      name: info.name.trim(),
      ownerId: userId,
      status: "pending",
      verified: false,
      reviewDueAt: Date.now() + Data.demoReviewSeconds * 1000,
      submittedAt: Date.now(),
      type: info.type,
      city: info.city.trim(),
      website: info.website.trim(),
      bio: "",
      contactEmail: admin.email,
      eventTypes: info.eventTypes,
      bank: { holder: info.name.trim(), name: "" },
      documents: documents,
      createdAt: todayIso(),
    };
    setUsers([...users, admin]);
    setOrganizations([...organizations, org]);
    return org;
  };

  /* The (simulated) trust team approves the application and gives an OrganizationID. */
  const approveOrganization = (orgId) => {
    const org = organizations.find((o) => o.id === orgId);
    const slug =
      org.name
        .replace(/[^a-zA-Z0-9]/g, "")
        .toUpperCase()
        .slice(0, 12) || "TEAM";
    const organizationId = "ORG-" + slug + "-" + (1000 + Math.floor(Math.random() * 9000));
    updateOrganization(orgId, { status: "approved", verified: true, organizationId: organizationId });
  };

  const requestPayout = (orgId, eventIds, gross) => {
    const fee = Math.round(gross * Data.platformFeeRate);
    const payout = {
      id: makeId("pay"),
      orgId: orgId,
      eventIds: eventIds,
      gross: gross,
      fee: fee,
      net: gross - fee,
      status: "processing",
      date: todayIso(),
    };
    setPayouts([payout, ...payouts]);
    showToast("Payout requested.");
  };

  /* Puts back the original demo data from Data.js. */
  const resetDemoData = () => {
    setUsers(Data.users);
    setOrganizations(Data.organizations);
    setEvents(Data.events);
    setTickets(Data.tickets);
    setReviews(Data.reviews);
    setPayouts(Data.payouts);
    setCurrentUserId(null);
    showToast("Demo data restored.");
  };

  /* Notifications of the organization dashboard (bell icon). */
  const orgNotifications = [];
  if (organization) {
    const orgEventIds = events.filter((e) => e.orgId === organization.id).map((e) => e.id);
    const needReply = reviews.filter((r) => orgEventIds.includes(r.eventId) && !r.reply).length;
    if (needReply > 0) {
      orgNotifications.push({
        id: "reviews",
        icon: "message",
        text: needReply + " reviews waiting for a reply",
        to: "/org/reviews",
      });
    }
    events
      .filter((e) => e.orgId === organization.id)
      .forEach((e) => {
        const status = eventStatus(e);
        if (status === "sold_out") {
          orgNotifications.push({
            id: "so-" + e.id,
            icon: "ticket",
            text: e.title + " is sold out",
            to: "/org/events/" + e.id,
          });
        }
        if (status === "almost_full") {
          orgNotifications.push({
            id: "af-" + e.id,
            icon: "ticket",
            text: e.title + " is almost full",
            to: "/org/events/" + e.id,
          });
        }
      });
  }

  /* Props that almost every attendee page needs. */
  const shared = {
    user: user,
    users: users,
    organizations: organizations,
    events: events,
    tickets: tickets,
    reviews: reviews,
    onLogout: logout,
    onToggleLike: toggleLike,
  };

  /* Props that every dashboard page needs. */
  const orgProps = {
    user: user,
    organization: organization,
    users: users,
    events: events,
    tickets: tickets,
    reviews: reviews,
    notifications: orgNotifications,
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Attendee pages */}
        <Route path="/" element={<Home {...shared}></Home>}></Route>
        <Route
          path="/event/:id"
          element={<EventDetails {...shared} onAddReview={addReview} showToast={showToast}></EventDetails>}
        ></Route>
        <Route path="/checkout/:id/:qty" element={<Checkout {...shared} onBook={bookTickets}></Checkout>}></Route>
        <Route path="/ticket/:id" element={<BookingConfirmed {...shared}></BookingConfirmed>}></Route>
        <Route
          path="/going"
          element={<GoingTo {...shared} onCancelBooking={cancelBooking} onAddReview={addReview}></GoingTo>}
        ></Route>
        <Route path="/my-events" element={<MyEvents {...shared} onDeleteEvent={deleteEvent}></MyEvents>}></Route>
        <Route
          path="/my-events/new"
          element={<HostEvent {...shared} onSave={saveEvent} onDelete={deleteEvent} showToast={showToast}></HostEvent>}
        ></Route>
        <Route
          path="/my-events/:id"
          element={<HostEvent {...shared} onSave={saveEvent} onDelete={deleteEvent} showToast={showToast}></HostEvent>}
        ></Route>
        <Route
          path="/profile"
          element={
            <Profile
              {...shared}
              onUpdateUser={updateUser}
              onChangePassword={changePassword}
              showToast={showToast}
            ></Profile>
          }
        ></Route>

        {/* Sign in / sign up — attendees */}
        <Route path="/login" element={<Login user={user} onLogin={login}></Login>}></Route>
        <Route path="/register" element={<Register user={user} onRegister={register}></Register>}></Route>
        <Route
          path="/forgot-password"
          element={
            <ForgotPassword
              resetRequest={resetRequest}
              onRequestReset={requestReset}
              onResend={resendResetCode}
              onConfirmReset={confirmReset}
            ></ForgotPassword>
          }
        ></Route>
        <Route
          path="/verify"
          element={
            <TwoStepVerification
              user={user}
              pendingLogin={pendingLogin}
              onVerify={verifyCode}
              onResend={resendCode}
              onCancel={cancelLogin}
            ></TwoStepVerification>
          }
        ></Route>

        {/* Sign in / sign up — organizations */}
        <Route path="/login/organization" element={<OrgLogin user={user} onLogin={login}></OrgLogin>}></Route>
        <Route
          path="/forgot-password/organization"
          element={
            <OrgForgotPassword
              organizations={organizations}
              resetRequest={resetRequest}
              onRequestReset={requestReset}
              onConfirmReset={confirmReset}
            ></OrgForgotPassword>
          }
        ></Route>
        <Route
          path="/register/organization"
          element={<ApplyOrganization users={users} onApply={applyOrganization}></ApplyOrganization>}
        ></Route>
        <Route
          path="/register/organization/submitted/:id"
          element={
            <ApplicationSubmitted
              organizations={organizations}
              onApprove={approveOrganization}
              showToast={showToast}
            ></ApplicationSubmitted>
          }
        ></Route>

        {/* Organization dashboard (the layout shows the sidebar + the page) */}
        <Route
          path="/org"
          element={<DashboardLayout user={user} organization={organization} onLogout={logout}></DashboardLayout>}
        >
          <Route index element={<Overview {...orgProps}></Overview>}></Route>
          <Route path="events" element={<Events {...orgProps}></Events>}></Route>
          <Route
            path="events/new"
            element={
              <CreateEvent {...orgProps} onSave={saveEvent} onDelete={deleteEvent} showToast={showToast}></CreateEvent>
            }
          ></Route>
          <Route
            path="events/:id"
            element={
              <CreateEvent {...orgProps} onSave={saveEvent} onDelete={deleteEvent} showToast={showToast}></CreateEvent>
            }
          ></Route>
          <Route path="reviews" element={<Reviews {...orgProps} onReply={replyToReview}></Reviews>}></Route>
          <Route
            path="payouts"
            element={
              <Payouts {...orgProps} payouts={payouts} onRequestPayout={requestPayout} showToast={showToast}></Payouts>
            }
          ></Route>
          <Route
            path="settings"
            element={
              <Settings
                {...orgProps}
                onUpdateOrganization={updateOrganization}
                onUpdateUser={updateUser}
                onChangePassword={changePassword}
                onLogout={logout}
                onResetDemo={resetDemoData}
                showToast={showToast}
              ></Settings>
            }
          ></Route>
        </Route>

        <Route path="/app" element={<Navigate to="/" replace></Navigate>}></Route>
        <Route path="*" element={<NotFound></NotFound>}></Route>
      </Routes>
      <Toast toast={toast} onClose={() => setToast(null)}></Toast>
    </BrowserRouter>
  );
}

export default App;
