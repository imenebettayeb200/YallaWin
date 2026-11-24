# Components — YallaWin

Every React component of the project, what it does and the props it receives.
Pages (in `src/pages/`) only assemble these components.

**How to read the tables**
- **Props**: values the parent passes in. `onX` props are functions called when something happens.
- **State / effects**: the `useState` / `useEffect` used inside the component (— = none, it only displays props).

---

## 1. `components/common/` — shared building blocks

| Component | What it does | Props | State / effects |
|---|---|---|---|
| **Icon** | Draws one SVG line icon by name (`calendar`, `star`, `ticket`…). | `name`, `size`, `strokeWidth`, `filled`, `className` | — |
| **Logo** | The italic serif "YallaWin" word, with an optional small subtitle ("FOR ORGANIZATIONS"). | `className`, `subtitle` | — |
| **Avatar** | Round (or square) badge with the initials of a name; the colour is chosen from the name. | `name`, `size`, `square` | — |
| **Stars** | 5 stars, filled up to the rating (read-only). | `rating`, `size` | — |
| **StarPicker** | 5 clickable stars to choose a rating. | `value`, `onChange(stars)`, `size` | — |
| **StatusBadge** | White pill with a coloured dot: On sale, Sold out, Almost full, Draft, Ended. | `status`, `label` (optional custom text) | — |
| **ProgressBar** | Thin blue bar showing `value / max` (tickets sold). | `value`, `max`, `color` | — |
| **EmptyState** | Icon + title + text shown when a list is empty. | `icon`, `title`, `text`, `action` | — |
| **Delta** | Green/red trend line under a KPI ("↗ +22% vs October"). | `value` (number or text), `suffix` | — |
| **EventThumb** | Small square picture of an event (cover image, or category colour + emoji). Also exports `coverStyle(event)`. | `event`, `size` | — |
| **Panel** | Dark glass card used everywhere; optional title and right-side actions. | `title`, `actions`, `className`, `as` (HTML tag) | — |
| **PillTabs** | Rounded tab bar with counters ("24 All · 6 Upcoming…"). | `tabs`, `value`, `counts`, `onChange(key)` | — |
| **SearchInput** | Search field with a magnifier icon. | `value`, `onChange(text)`, `placeholder`, `inputRef`, `className` | — |
| **Pagination** | "Showing 8 of 24" + previous/next buttons. | `page`, `pageCount`, `onChange(page)`, `shown`, `total` | — |
| **Dropdown** | Pill button that opens a menu of options (City, Sort). | `label`, `value`, `options`, `onChange(key)`, `icon` | `useState` open/closed · `useClickOutside` closes it |

## 2. `components/layout/` — page frames and navigation

| Component | What it does | Props | State / effects |
|---|---|---|---|
| **AuthLayout** | Dark page with coloured blobs and the big logo, around every login screen. | `children` | — |
| **DashboardLayout** | Two columns: `Sidebar` on the left, the current dashboard page on the right (`<Outlet />`). | — | — |
| **Sidebar** | Dashboard menu (items from `ORG_NAV` in data.js); highlights the current page. | — | reads the URL with `useLocation` |
| **SidebarAccount** | Organization card at the bottom of the sidebar (avatar, name, Verified, sign-out button). | `organization`, `onLogout()` | — |
| **PageHeader** | Page title + subtitle, with search, notifications, extra buttons and "Create event". Sets the browser tab title. | `title`, `subtitle`, `pageTitle`, `showCreate`, `showSearch`, `children` | `usePageTitle` (useEffect) |
| **NotificationsBell** | Bell with a pink dot; opens a list of alerts (reviews to answer, sold-out events…). | — | `useState` open · `useClickOutside` |
| **RequireAuth** | Protects a route: sends visitors to the login page and wrong roles to their home. | `role`, `children` | — |
| **ScrollToTop** | Scrolls to the top every time the URL changes. Renders nothing. | — | `useEffect` on the path |

## 3. `components/auth/` — sign-in screens

| Component | What it does | Props | State / effects |
|---|---|---|---|
| **AuthCard** | Glass form card with title, subtitle and error box. Sets the tab title. | `title`, `subtitle`, `error`, `onSubmit`, `className`, `pageTitle` | `usePageTitle` |
| **TextField** | Label + input + red error text. | `label`, `error`, `labelExtra`, any `<input>` prop | — |
| **PasswordField** | Password input with the eye button to show/hide it. | `label`, `error`, `labelExtra`, any `<input>` prop | `useState` visible |
| **Checkbox** | Checkbox with a label ("Keep me signed in"). | `label`, `checked`, `onChange(bool)` | — |
| **OtpInput** | The 6 boxes of the verification code: auto-advance, backspace, arrows, paste. | `value` (array of digits), `onChange(array)`, `hasError`; `ref.focus(i)` | `useRef` for the boxes |
| **SubmitButton** | Full-width white button with an arrow (grey when disabled). | `children`, `disabled`, `muted` | — |
| **AuthFooter** | "New to YallaWin? Create account" + divider + switch between attendee / organization. | `question`, `linkText`, `linkTo`, `switchText`, `switchLinkText`, `switchTo`, `externalIcon` | — |
| **BackLink** | "← Back to sign in" button. | `children`, `onClick` | — |
| **DemoAccounts** | "Demo: Organization / Attendee" buttons that fill the login form. | `onPick(account)`, `showAttendee` | — |
| **DemoInbox** | Corner card that shows the "emailed" code (there is no email server in a frontend demo). | `to`, `subject`, `code` | — |

## 4. `components/dashboard/` — Overview & Events

| Component | What it does | Props | State / effects |
|---|---|---|---|
| **KpiCard** | One stat card: label + icon, big value, footer line. | `label`, `icon`, `value`, `footer` | — |
| **KpiGrid** | The 4 cards: Revenue, Tickets sold, Upcoming events, Average rating. | `kpis` (from `useOverviewStats`) | — |
| **RangeToggle** | 7D / 30D / 90D switch. | `options`, `value`, `onChange` | — |
| **BarChart** | Vertical bars with date labels; the last bars use the pink→orange gradient; tooltip on hover. | `series` [{date, value}], `highlight`, `unit` | — |
| **TicketSalesChart** | "Ticket sales · last 30 days" panel: total, % change and the bar chart. | `sales` | `useState` range · `useMemo` series |
| **RevenueByEvent** | Coloured bars of revenue for the top events + "Other events". | `rows` [{id, label, value}] | — |
| **EventRow** | One table row: thumbnail, name, date, sold bar, revenue, status, arrow. | `event`, `orgName`, `onOpen(id)` | — |
| **EventTable** | Column headers + a list of `EventRow`. | `events`, `orgName`, `onOpen(id)` | — |
| **UpcomingEventsPanel** | "Upcoming events" panel with "View all" (or an empty state). | `events`, `orgName`, `limit` | — |

## 5. `components/create-event/` — Create / edit event

| Component | What it does | Props | State / effects |
|---|---|---|---|
| **BasicsSection** | "Basics" card: cover, title, category, description. | `form`, `errors`, `update(patch)`, `readOnly`, `onError(msg)` | — |
| **CoverUpload** | Drag & drop / browse an image (resized to fit storage), remove it, or generate a cover. | `value`, `onChange(dataUrl)`, `onGenerate()`, `onError(msg)`, `disabled` | `useState` drag-over · `useRef` file input |
| **IconField** | Label + input with an icon inside (title, date, time, venue). | `label`, `icon`, `error`, any `<input>` prop | — |
| **CategoryChips** | Workshop / Music / Nightlife… chips (from `CATEGORIES` in data.js). | `value`, `onChange(category)` | — |
| **WhenWhereSection** | "When & where" card: date, start, end, venue. | `form`, `errors`, `update(patch)` | — |
| **TicketTierRow** | One editable ticket type: name, price, quantity, delete. | `tier`, `error`, `onChange(patch)`, `onRemove()` | — |
| **TicketTiersSection** | "Tickets & capacity" card with all tiers + "Add ticket tier". | `tiers`, `errors`, `onChangeTier(id, patch)`, `onRemoveTier(tier)`, `onAddTier()` | — |
| **EventPreviewCard** | "LIVE PREVIEW" card that updates while you type. | `event` (the form) | — |
| **PublishChecklist** | "Ready to publish?" list with ✓ / ✗. | `items`, `heading` | — |
| **EventFormActions** | Header buttons: Delete, Save draft, Publish event / Save changes. | `canDelete`, `canSaveDraft`, `isPublished`, `readOnly`, `onDelete`, `onSaveDraft`, `onPublish` | — |

## 6. `components/reviews/` — Reviews page

| Component | What it does | Props | State / effects |
|---|---|---|---|
| **RatingSummary** | Big "4.7", stars, "128 reviews · 96% would go again" and the 5→1 bars. | `avg`, `total`, `goAgain`, `distribution` | — |
| **MentionsPanel** | "What people mention most" tags + the 3 most-reviewed events (click to filter). | `tags`, `topEvents`, `selectedEvent`, `onSelectEvent(id)` | — |
| **EventRatingCard** | Small card: event name + its average rating. | `name`, `avg`, `active`, `onClick` | — |
| **EventSelect** | "All events" drop-down filter. | `value`, `options`, `onChange(id)` | — |
| **ReviewCard** | One review: avatar, name, event · time ago, stars, text. | `review`, `eventName` | — |
| **ReplyCard** | Blue box with the organization's public reply. | `orgName`, `reply` | — |
| **ReplyForm** | "Write a public reply…" input + Reply button. | `authorName`, `onSubmit(text)` → `true` when saved | `useState` text |
| **ReviewItem** | A `ReviewCard` followed by its `ReplyCard` or a `ReplyForm`. | `review`, `eventName`, `orgName`, `onReply(id, text)` | — |

## 7. `components/payouts/` and `components/settings/`

| Component | What it does | Props | State / effects |
|---|---|---|---|
| **PayoutMethodCard** | Shows the bank used for payouts, with a link to edit it. | `payoutMethod` | — |
| **PayoutHistory** | Table of payouts: date, events, gross, fee, net, Paid/Processing. | `payouts`, `eventsById` | — |
| **ProfileForm** | Organization name, city, email, about, bank details + Save. | `organization`, `onSave(values)`, `onError(msg)` | `useState` form values |
| **VerificationCard** | "Verified" badge or the "Verify organization" button. | `verified`, `onVerify()` | — |
| **PasswordForm** | Current + new password, Update button. | `onSubmit(current, next)` → `true` when changed | `useState` both fields |
| **AccountCard** | "Signed in as…", Sign out and Reset demo data. | `email`, `onLogout()`, `onReset()` | — |

## 8. `components/home/` — public home page

| Component | What it does | Props | State / effects |
|---|---|---|---|
| **HomeBackground** | Coloured blurred blobs behind the page. | — | — |
| **HomeNav** | Top bar: logo, Home / Going To / My Events, search, Sign in or account menu, Dashboard button for organizations. | `tab`, `onTabChange`, `search`, `onSearch`, `user`, `onLogout` | — |
| **UserMenu** | Avatar + first name; menu with dashboard link and Sign out. | `user`, `onLogout()` | `useState` open · `useClickOutside` |
| **HomeHero** | "Welcome back, *Name*" (or "Welcome to *YallaWin*") + "TOP PICKS FOR YOU". | `user`, `children` | — |
| **TopPicksCarousel** | Carousel of the most popular events; rotates every 6 s; click a side card to centre it. | `events`, `orgNames`, `onOpen(event)` | `useState` active card · `useEffect` auto-rotate timer (with cleanup) |
| **PickCard** | One carousel card (big in the centre, smaller on the sides). | `event`, `orgName`, `offset`, `onClick` | — |
| **EventFilters** | Category chips, Free toggle, City and Sort menus (lists from data.js). | `filters`, `onChange(filters)`, `cities` | — |
| **EventGrid** | Grid of `EventCard` (or an empty state). | `events`, `saved` (Set of ids), `onToggleSave`, `onOpen`, `emptyTitle`, `emptyText` | — |
| **EventCard** | Portrait card: cover, heart, title, date · city, price, spots left. | `event`, `saved`, `onToggleSave(id)`, `onOpen(event)` | — |
| **EventModal** | Pop-up with event details, ticket choice, quantity and Pay / Reserve. | `event`, `orgName`, `user`, `onClose()` | `useState` tier, quantity, error · `useEffect` Escape key + lock page scroll (with cleanup) |
| **TierOptions** | Radio list of ticket types with tickets left and price. | `tiers`, `value`, `onChange(id)` | — |
| **QuantityPicker** | − 1 + stepper. | `value`, `max`, `onChange(n)` | — |
| **GoingToSection** | "Going to" tab: list of the user's upcoming tickets. | `tickets`, `onOpen`, `onBrowse` | — |
| **TicketItem** | One ticket row: thumbnail, event, quantity, ticket code. | `event`, `qty`, `onOpen` | — |
| **MyEventsSection** | "My Events" tab: saved events + attended events. | `savedEvents`, `saved`, `attended`, `myReviews`, `onToggleSave`, `onOpen`, `onReview` | — |
| **AttendedItem** | Past event row with the user's review or a form to write one. | `event`, `review`, `onReview(event, rating, text)` | — |
| **QuickReviewForm** | Stars + short text + Post. | `onSubmit(rating, text)` | `useState` rating, text |

---

## Custom hooks (`src/hooks/`)

| Hook | What it does | Uses |
|---|---|---|
| **useDbState** (`data/useDb.js`) | Gives the whole database and re-renders when it changes. | `useState` + `useEffect` (subscribe / unsubscribe) |
| **useLocalStorageState** | Like `useState`, but remembered after a refresh (home filters). | `useState` + `useEffect` (save) |
| **useDebounce** | Waits until the user stops typing before using the value (home search). | `useState` + `useEffect` (timer with cleanup) |
| **usePageTitle** | Sets the browser tab title. | `useEffect` |
| **useClickOutside** | Closes menus on outside click or Escape. | `useEffect` (listeners with cleanup) |
| **useOverviewStats** | All numbers of the Overview page. | `useMemo` |
| **useOrgEventList** | Events of the organization by tab + search, with counters. | `useMemo` |
| **useEventForm** | State and updaters of the create / edit event form. | `useState`, `useMemo` |
| **useReviewStats** | Reviews, distribution, tags and per-event ratings. | `useMemo` |
| **useHomeEvents** | Top picks, filtered events, cities and the user's tickets. | `useMemo` |