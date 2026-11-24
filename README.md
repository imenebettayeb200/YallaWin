# YallaWin — Events management (React + Vite)

## Course files
| File | What it is |
|---|---|
| [Agent.md](Agent.md) | How to work in this project |
| [COMPONENTS_GUIDE.md](COMPONENTS_GUIDE.md) | What each page and component does, the routes and the user journeys |
| [src/Data.js](src/Data.js) | **All the data** (users, events, tickets, reviews...) and every list of options |
| [src/App.jsx](src/App.jsx) | All the state (`useState`), the actions and the routes |

Pages are wired with React Router in `src/App.jsx`. Only `useState` and `useEffect` are used; data goes down as props.

## Run it
```bash
npm install
npm run dev        # opens http://localhost:5173
npm run build      # production build in /dist
```

## How the app flows
```
Home (/) ─► Event (/event/:id) ─► Checkout (/checkout/:id/:qty) ─► Ticket (/ticket/:id) ─► Going To (/going)
   │                                     ▲ sign in first if needed
   └─► Sign in (/login) ─► 6-digit code (/verify) ─► Home (attendee) or Dashboard /org (organization)
```

## Demo accounts
| Role | Email / ID | Password | Lands on |
|---|---|---|---|
| Attendee | sarra@example.com | Sarra2026 | `/` |
| Attendee | ines@example.com | Ines2026 | `/` |
| Organization | contact@follamour.tn or ORG-FOLLAMOUR-2041 | Follamour2026 | `/org` |

The 6-digit codes appear in a **Demo inbox** card (bottom right) because a frontend-only app has no email server.

See [COMPONENTS_GUIDE.md](COMPONENTS_GUIDE.md) for every page, route and component.
