# YallaWin: Components and pages guide

This file explains what every file in `src/` does and what it is used for.
Read it together with `src/App.jsx` (all the state and routes) and `src/Data.js` (all the data).

---

## 1. How the app works (big picture)

```
Data.js  ──►  App.jsx (useState for everything)  ──►  pages (props)  ──►  components (props)
                │                                              │
                └── useEffect saves the state in localStorage ◄┘ actions: onBook, onSave, onReply...
```

- **`src/Data.js` is the only data file.** Users, organizations, events, tickets, reviews,
  payouts, categories, menus, tabs, filters, fees and demo accounts are all there as
  `export const ... = [...]`. To plug in a database later, replace these arrays with API calls
  in `App.jsx`; nothing else has to change.
- **`src/App.jsx` holds the state** with `useState` (users, organizations, events, tickets,
  reviews, payouts, current user, pending login, password reset, toast) and the **actions**
  that change it (`login`, `bookTickets`, `saveEvent`, `addReview`...). Pages receive the data
  and the actions as **props**.
- **One `useEffect` in App.jsx** saves everything in the browser's `localStorage`
  (key `yallawin-data-v3`), so bookings and new events are still there after a refresh.
  *Settings → Reset demo data* puts back the original Data.js content.
- **Only `useState` and `useEffect`** are used as React hooks. From React Router we use the
  normal tools: `Routes`, `Route`, `Link`, `NavLink`, `Navigate`, `Outlet`, `useNavigate` and `useParams`.
- **`src/utils.js`** has plain helper functions (dates, prices, validation, ids, stats...).
- **Styles**: `styles/global.css` (variables, attendee pages, dashboard), `styles/org-auth.css`
  (organization sign-in screens), `styles/pages.css` (event page, checkout, ticket, Going To,
  My Events, profile, phone layout).

### Demo accounts
| Who | Email / ID | Password | Goes to |
|---|---|---|---|
| Attendee | sarra@example.com | Sarra2026 | `/` |
| Attendee 2 | ines@example.com | Ines2026 | `/` |
| Organization | contact@follamour.tn or ORG-FOLLAMOUR-2041 | Follamour2026 | `/org` |

There is no email server, so every code (2-step sign in, password reset, organization
review) appears in the **Demo inbox** box at the bottom right of the screen.

### All the pages (routes)
| Address | Page file | Who |
|---|---|---|
| `/` | pages/Home.jsx | everyone |
| `/event/:id` | pages/EventDetails.jsx | everyone |
| `/checkout/:id/:qty` | pages/Checkout.jsx | signed-in attendee |
| `/ticket/:id` | pages/BookingConfirmed.jsx | owner of the ticket |
| `/going` | pages/GoingTo.jsx | signed-in attendee |
| `/my-events` | pages/MyEvents.jsx | signed-in attendee |
| `/my-events/new`, `/my-events/:id` | pages/HostEvent.jsx | signed-in attendee |
| `/profile` | pages/Profile.jsx | signed-in user |
| `/login`, `/register`, `/forgot-password`, `/verify` | pages/auth/* | attendees (verify is used by both) |
| `/login/organization`, `/forgot-password/organization` | pages/org-auth/* | organizations |
| `/register/organization`, `/register/organization/submitted/:id` | pages/org-auth/* | new organizations |
| `/org` + `events`, `events/new`, `events/:id`, `reviews`, `payouts`, `settings` | pages/org/* inside DashboardLayout | organization accounts |
| anything else | pages/NotFound.jsx | everyone |

### Main user journeys
1. **Buy a ticket**: Home → click a card → Event page → choose quantity → *Book now* →
   (sign in if needed) → Checkout: Tickets → Your details → Payment → *Confirm* →
   "You're going!" ticket page with QR code → Going To.
2. **Review an event**: Going To → banner "How was ...?" or *Leave review* on a past booking →
   review window (stars, tags, text) → the review appears on the event page and in the organizer's Reviews.
3. **Host as an attendee**: My Events → *Create event* → form with live preview → Publish →
   the event appears on the Home page.
4. **Organization**: Sign in with OrganizationID → code → Dashboard Overview → Events / Create event /
   Reviews (reply) / Payouts (request) / Settings.
5. **New organization**: *Apply as an organization* → 3 steps (info, documents, review) →
   "Application submitted" page → approved after 20 seconds (demo) → sign in.

---

## 2. Root files

| File | What it does |
|---|---|
| `main.jsx` | Starts React (`createRoot`) and loads the 3 CSS files. |
| `App.jsx` | All the state, all the actions, the list of routes, the Toast. See section 1. |
| `Data.js` | All the data and every list of options (see the comments inside it for each field). |
| `utils.js` | Helper functions: `formatTND`, `formatShortDate`, `timeAgo`, `eventStatus`, `spotsLeft`, `minPrice`, `averageRating`, `isValidEmail`, `passwordError`, `makeTicketNumber`, `generateCover` (makes a cover picture from the category), `dailyTotals` (sales per day for the chart)... |

### Actions in App.jsx (passed as props)
| Action | Used by | What it does |
|---|---|---|
| `login(id, password, asOrg)` | Login, OrgLogin | Checks the account and creates a 6-digit code. Returns an error text or "". |
| `verifyCode`, `resendCode`, `cancelLogin` | TwoStepVerification | Finishes / restarts / cancels the sign in. |
| `logout` | Navbar, Sidebar, Profile | Signs out. |
| `register(form)` | Register | Creates an attendee and signs in. |
| `updateUser`, `changePassword` | Profile | Edits the signed-in user. |
| `requestReset`, `resendResetCode`, `confirmReset` | ForgotPassword, OrgForgotPassword | Password reset by code. |
| `toggleLike(eventId)` | Home, EventDetails, GoingTo | Adds/removes an event from the user's likes. |
| `saveEvent(event, publish)`, `deleteEvent(id)` | CreateEvent, HostEvent | Creates, edits, publishes or deletes an event. |
| `bookTickets(booking)` | Checkout | Creates the ticket and updates the "sold" count of the tier. |
| `cancelBooking(ticketId)` | GoingTo | Cancels a ticket and frees the places. |
| `addReview`, `replyToReview` | GoingTo / EventDetails, org Reviews | Writes a review / the organizer's public reply. |
| `updateOrganization` | org Settings | Saves profile and bank details. |
| `applyOrganization`, `approveOrganization` | ApplyOrganization, ApplicationSubmitted | Organization sign-up and (demo) approval. |
| `requestPayout` | org Payouts | Creates a pending payout for the ended events. |
| `resetDemoData` | org Settings | Puts back the Data.js content. |
| `showToast(text, type)` | many | Shows a small message at the bottom. |

---

## 3. Pages (`src/pages/`)

Pages get their data from App.jsx through props and put components together.

### Attendee pages
| Page | What it shows / does |
|---|---|
| **Home** | Navbar with search, "Welcome back, Sarra", Top picks carousel, "This weekend" (phones), category chips, Free switch, City and Sort filters, the grid of event cards (with like button). Search, filters and sort are `useState`; the list is filtered on each render. |
| **EventDetails** | One event: cover, date and time, host card, book box (quantity, price, like, share), about, lineup, location with Directions, reviews from past editions of the same host (with "Write a review" if you attended), "You might also like". Phones get the bottom *Book* bar. Shows "You're going" if you already have a ticket. |
| **Checkout** | 3 steps with a stepper: **Tickets** (choose a tier and quantity), **Your details** (name, email, phone, checked), **Payment** (Card / D17 / Pay at door; card fields checked; free events skip payment). Right side: order summary with service fee and total. *Confirm* calls `onBook` and opens the ticket. |
| **BookingConfirmed** | "You're going!" with the ticket card and QR code, and buttons to Going To and back to the events. Also used to look at a ticket later. |
| **GoingTo** | Tabs All / Upcoming / Past / Liked. "Next up" big card with the ticket, Directions, View ticket, Cancel (only until 24h before). Upcoming bookings, a banner asking for a review of the last event you attended, past events with *Leave review* or your stars, liked events grid. |
| **MyEvents** | For attendees who host small events: 4 numbers (events, tickets sold, revenue, rating), tabs Published / Drafts / Past, list of events with *View* and *Manage*, latest reviews. Organization accounts are sent to `/org/events`. |
| **HostEvent** | Create or edit an attendee's event with the shared `EventForm`. Paid events need a verified phone (Profile). |
| **Profile** | Name, phone (verify with a code), email, interests, small stats, change password, sign out. |
| **NotFound** | "This page doesn't exist" with a button back home. |

### Sign-in pages (`pages/auth/`)
| Page | What it does |
|---|---|
| **Login** | Email + password, demo account buttons, links to register and forgot password. On success goes to `/verify`. |
| **Register** | First name, last name, email, password (rules shown), interests, terms. |
| **TwoStepVerification** | 6 boxes for the code, "Resend code" after 30 seconds, trust this device, cancel. Blue style for organizations. Sends organizations to `/org` and attendees to `/`. |
| **ForgotPassword** | Step 1: email. Step 2: "Check your inbox": the code + new password, resend countdown. |

### Organization access pages (`pages/org-auth/`)
| Page | What it does |
|---|---|
| **OrgLogin** | "Sign in with your OrganizationID" (the admin email also works). |
| **OrgForgotPassword** | Recover access in 2 steps (ID or email → code + new password). |
| **ApplyOrganization** | 3-step form (stepper): organization info → documents (some are required depending on the event types) → review and accept terms. |
| **ApplicationSubmitted** | Status timeline of the application; in the demo it is approved after 20 seconds and you can sign in. |

### Dashboard pages (`pages/org/`, inside `DashboardLayout`)
| Page | What it does |
|---|---|
| **Overview** | Greeting, 4 KPI cards (revenue this month, tickets sold, upcoming events, average rating), ticket sales chart (7D / 30D), revenue by event, next 4 events. |
| **Events** | Tabs All / Upcoming / Drafts / Past, search, table of events with sold bar, revenue and status, pages of 8. Click a row to edit. |
| **CreateEvent** | Create or edit an organization event with `EventForm` (live preview, ticket tiers, publish checklist, delete). |
| **Reviews** | Rating summary, filter by event, ratings per event, most mentioned tags, list of reviews with the public reply form. |
| **Payouts** | Available balance (ended events, minus the 5% platform fee), request a payout, pending amount, payout history, bank card. |
| **Settings** | Profile and bank details, verification card, change password, account (sign out, reset demo data). |

---

## 4. Components (`src/components/`)

### layout/ (page frames)
| Component | What it does |
|---|---|
| **Navbar** | Top bar of attendee pages: logo, Home / Going To / My Events (NavLink), search (only on Home), Sign in or the UserMenu. Also renders the phone tab bar. |
| **UserMenu** | Name button that opens Profile, Tickets, Dashboard (organizations) and Sign out. |
| **MobileTabBar** | Bottom tab bar on phones (Home, Tickets, Host, Profile). Hidden on computers by CSS. |
| **Background** | Coloured blurred blobs behind attendee pages. |
| **AuthLayout** | Frame of the attendee sign-in pages. |
| **OrgAuthLayout** | Frame of the organization sign-in pages (lighter, blue). |
| **DashboardLayout** | Frame of the dashboard: Sidebar + the current page (`Outlet`). Sends you to sign in if you are not an organization. |
| **Sidebar** | Left menu of the dashboard (links from `orgNav` in Data.js). |
| **SidebarAccount** | Organization name, Verified badge, sign out. |
| **PageHeader** | Title + subtitle of a dashboard page, bell and *Create event* button. |
| **NotificationsBell** | Bell with red dot and list (almost sold out, new reviews, payouts...). |

### common/ (small pieces used everywhere)
| Component | What it does |
|---|---|
| **Icon** | All the line icons as SVG, chosen with `name`. |
| **Logo** | "YallaWin" in italic serif. |
| **Avatar** | Bubble with initials. |
| **Panel** | Dark glass card with a title. |
| **PillTabs** | Rounded tabs with counts. |
| **Dropdown** | Small menu button (City, Sort...). Closes when you click outside. |
| **SearchInput** | Text box with magnifier. |
| **QuantityPicker** | − 1 + buttons. |
| **Stepper** | 1 → 2 → 3 steps with ticks. |
| **Stars** / **StarPicker** | Shows a rating / lets you pick one. |
| **StatusBadge** | Dot + label: On sale, Almost full, Sold out, Draft, Ended. |
| **ProgressBar** | Sold / capacity bar. |
| **Delta** | Green or red "+12% vs October". |
| **EventThumb** | Small picture of an event. |
| **EmptyState** | Message shown when a list is empty. |
| **Pagination** | "Showing 8 of 24" + previous/next. |
| **QrCode** | Square QR-like picture made from the ticket number. |
| **Toast** | Message at the bottom that closes itself after 3.5 s (`useEffect` + `setTimeout`). |

### home/
| Component | What it does |
|---|---|
| **HomeHero** | Welcome title, today's date, number of events on sale. |
| **TopPicksCarousel** | 5 cards turning around the centre one, arrows; click opens the event. |
| **PickCard** | One card of the carousel. |
| **WeekendList** | "This weekend" small cards (phones). |
| **EventFilters** | Category chips, Free switch, City and Sort dropdowns. |
| **EventGrid** | Grid of EventCards or an empty message. |
| **EventCard** | Card with cover, title, date, place, "in 3 days", price, spots left, like button. Links to the event. |

### event/ (event page)
| Component | What it does |
|---|---|
| **HostCard** | "Hosted by ..." with verified badge and number of events. |
| **BookBox** | Price, quantity, *Book now*, like and share; shows "Sold out", "Ended" or "You're going". |
| **MobileBookBar** | The same, as a bar at the bottom of the screen on phones. |
| **LineupList** | Artists / speakers. |
| **LocationCard** | Venue, address, small map drawing and *Directions* (Google Maps). |
| **PastReviews** | Average rating, 5→1 bars and reviews of the host's past events. |

### booking/ (checkout and ticket)
| Component | What it does |
|---|---|
| **TierOptions** | Ticket types to choose from (sold out ones disabled). |
| **DetailsForm** | Name, email, phone with error messages. |
| **PaymentPicker** | Card / D17 / Pay at door + card fields. |
| **OrderSummary** | Recap, service fee, total and the main button. |
| **TicketCard** | White ticket with number, guests, date, place and QR code. |

### going/ (Going To page)
| Component | What it does |
|---|---|
| **NextUpCard** | Big card of your next event with its ticket and buttons. |
| **BookingRow** | One booking in the list (View ticket / Leave review / your stars). |
| **ReviewPrompt** | "How was ...?" banner. |

### myevents/
| Component | What it does |
|---|---|
| **HostedEventRow** | One hosted event: picture, date, sold bar, status, View, Manage. |

### create-event/ (shared by organizations and attendees)
| Component | What it does |
|---|---|
| **EventForm** | The whole create/edit screen: keeps the form in `useState`, checks it, shows the preview and the checklist, saves as draft or publishes. Used by `org/CreateEvent` and `HostEvent`. |
| **EventFormActions** | Delete · Save draft · Publish / Save changes buttons. |
| **BasicsSection** | Title, category, description, cover. |
| **CategoryChips** | Category choice. |
| **CoverUpload** | Choose a picture (checked: image, max size). Without a picture a cover is drawn from the category. |
| **WhenWhereSection** | Date, start and end time, venue, address. |
| **TicketTiersSection** / **TicketTierRow** | List of ticket types (name, price, quantity) with add/remove. |
| **IconField** | Input with an icon inside. |
| **EventPreviewCard** | Live preview of the card while you type. |
| **PublishChecklist** | "Ready to publish?" ✓ / ✗ list, each item links to the field to fix. |

### dashboard/
| Component | What it does |
|---|---|
| **KpiGrid** / **KpiCard** | The 4 numbers at the top of Overview. |
| **TicketSalesChart** | Sales chart with the 7D / 30D toggle. |
| **RangeToggle** | The 7D / 30D buttons. |
| **BarChart** | Draws the bars (last ones in the pink-orange gradient). |
| **RevenueByEvent** | Top events by revenue with bars. |
| **UpcomingEventsPanel** | Next events table + "View all". |
| **EventTable** / **EventRow** | Table of events; each row links to the edit page. |

### reviews/
| Component | What it does |
|---|---|
| **RatingSummary** | Big average + 5→1 distribution. |
| **EventSelect** | "All events" filter. |
| **EventRatingCard** | Average of one event, clickable to filter. |
| **MentionsPanel** | Most used tags + most reviewed events. |
| **ReviewItem** | A review + the reply or the reply form. |
| **ReviewCard** | Author, event, stars, date, text. |
| **ReplyCard** | The organization's public reply. |
| **ReplyForm** | "Write a public reply..." input. |
| **WriteReviewModal** | Window used by attendees to write a review (stars, tags, text). Escape closes it. |

### payouts/
| Component | What it does |
|---|---|
| **PayoutHistory** | List of past payouts with their status. |
| **PayoutMethodCard** | Bank account used for payouts. |

### settings/
| Component | What it does |
|---|---|
| **ProfileForm** | Organization name, email, phone, city, description, bank. |
| **VerificationCard** | Verified status of the organization. |
| **PasswordForm** | Current / new / confirm password. |
| **AccountCard** | Sign out and *Reset demo data*. |

### auth/ (sign-in forms)
| Component | What it does |
|---|---|
| **AuthCard** | Glass card of a sign-in form; also sets the browser tab title. |
| **TextField** / **PasswordField** | Input with label and error (password has the eye button). |
| **Checkbox** | Checkbox with label. |
| **SubmitButton** | Big white submit button. |
| **OtpInput** | 6 code boxes; typing moves to the next box, paste fills all. |
| **DemoAccounts** | Buttons that fill a demo account. |
| **DemoInbox** | Fake email box showing the code (no email server in a frontend app). |
| **InterestPicker** | "What are you into?" category chips. |
| **AuthFooter** / **BackLink** | Links under the form / "← Back". |

### org-auth/ (organization sign-up)
| Component | What it does |
|---|---|
| **WizardCard** / **WizardFooter** | Card and Back/Continue buttons of each step. |
| **OrgInfoStep** | Step 1: name, type, city, website, event types, admin email and password. |
| **OrgTypeSelect** / **EventTypeChips** | Choice of organization type / event types. |
| **DocumentsStep** / **DocumentUploadRow** | Step 2: upload each document (checked type and size). |
| **ReviewStep** / **ReviewSection** | Step 3: summary with Edit links and terms. |
| **StatusTimeline** | Steps of the application review. |
| **SecurityNote** | Small grey note with a lock icon. |

---

## 5. Where to change things

| I want to... | Change |
|---|---|
| add an event, a user, a review | `src/Data.js` (or use the app; then *Reset demo data* to go back) |
| add a category | `categories` + `categoryThemes` in Data.js |
| change the service fee / platform fee | `serviceFeePerTicket`, `platformFeeRate` in Data.js |
| add a page | create it in `src/pages/`, add a `<Route>` in App.jsx, add a link in `userNav` / `orgNav` |
| connect a real database | in App.jsx, load the arrays with `useEffect` + `fetch` and make each action call the API |

## 6. Limits of the demo (to fix with a backend)
- Passwords are stored in plain text in Data.js / localStorage. A real server must hash them.
- Codes are shown in the Demo inbox instead of being emailed. Payments are not real.
- The QR code and the map are drawings, not a real QR / real map.
