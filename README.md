# YallaWin — Events management (React + Vite)

## Run it
```bash
npm install
npm run dev        # opens http://localhost:5173
npm run build      # production build in /dist
```

## How the app flows
```
Home page (/)  ──►  Sign in (/login)  ──►  2-step code (/verify)  ──►  Dashboard (/org)
  public              email + password      6-digit code                organizations
```
- **Home page** is public: anyone can browse events.
- Clicking **Sign in** with an **organization** account opens the **dashboard**
  (Overview, Events, Create event, Reviews, Payouts, Settings).
- An **attendee** account goes back to the home page, where **Going To** and
  **My Events** unlock and tickets can be bought.
- Signing out returns you to the home page.

## Demo accounts
| Role | Email | Password | Lands on |
|---|---|---|---|
| Organization | contact@follamour.tn | Follamour2026 | `/org` dashboard |
| Attendee | sarra@example.com | Sarra2026 | `/` home page |

The login page has a demo button for each account that fills in the email and password.
**Two-step verification:** there is no email server in a frontend-only app,
so the 6-digit code appears in a **"Demo inbox"** card (bottom-right).

## Pages
| Route | Page |
|---|---|
| `/login`, `/login/organization` | Sign in |
| `/verify` | Two-step verification (6-digit code, resend, trust device 30 days) |
| `/register`, `/register/organization` | Create account |
| `/forgot-password` | Reset password by code |
| `/` | Public home page: top picks, all events, filters (+ Going To / My Events when signed in) |
| `/org` | Overview (KPIs, ticket-sales chart, revenue by event, upcoming) |
| `/org/events` | Events list (All / Upcoming / Drafts / Past, search, pages) |
| `/org/events/new`, `/org/events/:id` | Create / edit event with live preview |
| `/org/reviews` | Reviews, rating stats, public replies |
| `/org/payouts` | Balance, payout requests, history |
| `/org/settings` | Profile, bank, verification, password, reset demo data |

## Structure (component-based)
Pages only **assemble components**. Logic lives in hooks and services, and UI lives in small components.
```
src/
├── main.jsx                  entry (Router + Toast + Auth providers)
├── App.jsx                   all routes
├── pages/                    thin screens that assemble components
│   ├── home/Home.jsx
│   ├── auth/  Login · TwoStepVerification · Register · ForgotPassword
│   └── org/   Overview · Events · CreateEvent · Reviews · Payouts · Settings
├── components/
│   ├── common/        Icon, Logo, Avatar, Stars, StarPicker, StatusBadge, ProgressBar,
│   │                  EmptyState, Delta, EventThumb, Panel, PillTabs, SearchInput,
│   │                  Pagination, Dropdown
│   ├── layout/        AuthLayout, DashboardLayout, Sidebar, SidebarAccount,
│   │                  PageHeader, NotificationsBell, RequireAuth
│   ├── auth/          AuthCard, TextField, PasswordField, Checkbox, OtpInput,
│   │                  SubmitButton, AuthFooter, BackLink, DemoAccounts, DemoInbox
│   ├── dashboard/     KpiCard, KpiGrid, RangeToggle, BarChart, TicketSalesChart,
│   │                  RevenueByEvent, EventRow, EventTable, UpcomingEventsPanel
│   ├── create-event/  CoverUpload, IconField, CategoryChips, BasicsSection,
│   │                  WhenWhereSection, TicketTierRow, TicketTiersSection,
│   │                  EventPreviewCard, PublishChecklist, EventFormActions
│   ├── reviews/       RatingSummary, MentionsPanel, EventRatingCard, EventSelect,
│   │                  ReviewCard, ReplyCard, ReplyForm, ReviewItem
│   ├── payouts/       PayoutMethodCard, PayoutHistory
│   ├── settings/      ProfileForm, VerificationCard, PasswordForm, AccountCard
│   └── home/          HomeNav, UserMenu, HomeBackground, HomeHero, TopPicksCarousel,
│                      PickCard, EventFilters, EventGrid, EventCard, EventModal,
│                      TierOptions, QuantityPicker, GoingToSection, TicketItem,
│                      MyEventsSection, AttendedItem, QuickReviewForm
├── hooks/             useClickOutside, useOverviewStats, useOrgEventList,
│                      useEventForm, useReviewStats, useHomeEvents
├── context/           AuthContext (sessions, login, 2FA), ToastContext
├── models/index.js    JS data model (typedefs, factories, validation, status rules)
├── data/              db.js (localStorage DB), useDb.js, seed.js (demo data), artwork.js
├── services/          eventService.js (save events, buy tickets, reviews, payouts)
├── utils/             crypto, dates, format, ids, image, stats
└── styles/global.css
```

## Important: this is frontend-only
Data lives in the browser's **localStorage**, and passwords are hashed with SHA-256 plus a salt.
That's fine for a school project or a demo, but it is **not secure for real users**. To go live,
replace `src/data/db.js` and `AuthContext.jsx` with calls to a real backend (for example
Node/Express with PostgreSQL, or Firebase or Supabase), and send the 2FA emails from that server.
