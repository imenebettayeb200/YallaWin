# AGENTS.md — YallaWin

> Instructions for anyone (student, teammate or AI coding agent) who works on this project.
> Read this file first. Follow the **Rules** section for every change.

---

## 1. Idea

**YallaWin** is an event management platform for Tunisia.

- **Attendees** browse events on a public home page (concerts, nightlife, sport, workshops,
  tech, adventure), save favourites, buy tickets and review events they attended.
- **Organizations** (clubs, venues, companies) sign in to a **dashboard** where they:
  - see revenue, tickets sold, upcoming events and their average rating (**Overview**)
  - list, search and edit all their events (**Events**)
  - create an event with a cover, date, venue and ticket tiers, with a live preview (**Create event**)
  - read and answer reviews from attendees (**Reviews**)
  - follow their money and request payouts (**Payouts**)
  - edit their profile, bank details and password (**Settings**)

**User flow**

```
Home page (/)  →  Sign in (/login)  →  6-digit code (/verify)  →  Dashboard (/org)
  public            email + password      two-step verification      organizations only
```

The UI follows the team's Figma designs: dark background, coloured blurred blobs,
glass cards, an italic serif logo and a pink → orange gradient for main actions.

---

## 2. Tech stack

| What | Choice |
|---|---|
| UI | **React 18** (function components + hooks) |
| Build tool | **Vite 5** |
| Routing | **React Router 6** |
| Data | `src/Data.js` (all data) → `useState` in App.jsx → saved in **localStorage** by a `useEffect` |
| Styles | `src/styles/global.css` (CSS variables at the top) + `org-auth.css` + `pages.css` |
| Fonts | Inter (text) + Instrument Serif italic (logo, big numbers) |

Run it: `npm install`, then `npm run dev` → http://localhost:5173

Demo logins (also available as buttons on the login page):
- Organization: `contact@follamour.tn` / `Follamour2026`
- Attendee: `sarra@example.com` / `Sarra2026`

---

## 3. Rules

### React
1. **Only function components and hooks.** No class components.
2. **State = `useState`.** Every value that changes on screen (form inputs, open/closed menus,
   selected tab, current page…) is stored with `useState`.
3. **Side effects = `useEffect`.** Timers, event listeners, subscriptions, `localStorage`
   and `document.title` are handled in `useEffect`, and **every effect that starts something
   returns a cleanup function** (clear the timer, remove the listener, unsubscribe).
4. **Keep the dependency array honest**: list every value the effect uses.
5. **Only `useState` and `useEffect`.** No custom hooks, no context, no `useRef`/`useMemo`.
   All app data lives in `src/App.jsx` and goes down to pages and components as **props**.

### Components
6. **One component per file**, file name = component name in PascalCase (`EventCard.jsx`).
7. **Pages only assemble components.** A page in `src/pages/` must not contain long JSX —
   split it into components in `src/components/<feature>/`.
8. Every component is **documented in [`COMPONENTS_GUIDE.md`](COMPONENTS_GUIDE.md)**
   (what it does + its props + the state/effects it uses). Add a short comment at the top
   of the file when the component is not obvious. When you add or change a component,
   update `COMPONENTS_GUIDE.md`.
9. Components receive data through **props** and report actions through **callback props**
   named `onSomething` (`onOpen`, `onChange`, `onSubmit`).
10. Shared, generic pieces (buttons, tabs, badges, cards) go in `components/common/`.

### Data
11. **Every piece of data lives in `src/Data.js`**: categories, colours, menus, tabs, filters,
    sort options, fees, users, organizations, events, tickets, reviews and payouts. Never hard-code
    a list of content or options inside a component.
12. `src/App.jsx` copies Data.js into `useState` and one `useEffect` saves it in `localStorage`.
    Components never touch `localStorage`; they call the action props (`onBook`, `onSave`...).
13. Write code like in class: `function Name() {}` + `export default Name;`, double quotes,
    CSS classes (no inline colours except data-driven ones).
14. To connect a database later, only `App.jsx` changes (load with `fetch` in a `useEffect`).

### Style & design
15. Use the CSS variables from `global.css` (`--blue`, `--pink`, `--gradient`, `--panel`…).
    No inline colours except data-driven ones (category colours, chart bars).
16. Match the Figma designs: dark theme, glass panels (`.panel`), pill buttons, Inter + serif logo.
17. Use the **Taste skill** for design work (see section 5): no generic "AI-looking" UI.

### Quality
18. `npm run build` must pass with **no errors** before you commit.
19. Show a friendly message for every error (toast or red text). The app must never crash
    on empty data (no events, no reviews…): use `EmptyState`.
20. Keep it accessible: buttons are `<button>`, inputs have labels, icons-only buttons have `aria-label`.
21. Passwords are plain text in the demo data. A real launch needs a backend that hashes them.

---

## 4. Project structure

```
src/
├── main.jsx · App.jsx        entry point · all state, actions and routes
├── Data.js                   ALL the data
├── utils.js                  helper functions (dates, prices, validation, stats)
├── pages/                    Home, EventDetails, Checkout, BookingConfirmed, GoingTo, MyEvents,
│   │                         HostEvent, Profile, NotFound
│   ├── auth/                 Login, Register, TwoStepVerification, ForgotPassword
│   ├── org-auth/             OrgLogin, OrgForgotPassword, ApplyOrganization, ApplicationSubmitted
│   └── org/                  Overview, Events, CreateEvent, Reviews, Payouts, Settings
├── components/               one folder per feature (see COMPONENTS_GUIDE.md)
└── styles/                   global.css · org-auth.css · pages.css
```

---

## 5. AI tools

### Taste skill (design)
[Taste Skill](https://github.com/Leonxlnx/taste-skill) is a `SKILL.md` file that gives an AI
coding agent design rules (layout, typography, colours, spacing, motion) so the UI does not look
generic. Install it in the project:

```bash
npx skills add https://github.com/Leonxlnx/taste-skill --skill "design-taste-frontend"
```

When you ask an agent to change the design, tell it to **follow the Taste skill and keep the
Figma style described above**.

### OpenRouter (models)
[OpenRouter](https://openrouter.ai) gives one API key for many AI models. Use it as the model
provider of your coding agent (for example in Cline, Kilo Code, Roo Code or OpenCode):
choose "OpenRouter" as the provider, paste your key, pick a model.
**Never commit the API key**: keep it in a `.env` file that is listed in `.gitignore`.

### How to ask an agent for a change
1. "Read `Agent.md` and `COMPONENTS_GUIDE.md` first."
2. Describe the change and the page it affects.
3. "Follow the Rules; put new data in `src/Data.js`; update `COMPONENTS_GUIDE.md`; run `npm run build`."