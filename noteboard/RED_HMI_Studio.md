# RED HMI Studio · Working

Object: one local HMI artboard. User: the founder, in a buyer meeting, sketching a screen before a demo exists.
Host: https://xrealtimeeng.github.io/innovatered-preview/noteboard/
SKU: Working. Not the live RPS planner. Not a live tag feed.

## What it is

A static page. Paint, device frames, and drag-in templates stay in the browser (`localStorage` key `red-noteboard-working-v5`). There is no server in this SKU and no token in the page.

The code that is live sits on the `gh-pages` branch of `xRealtimeEng/innovatered-preview`, folder `noteboard/`. The working copy for this sitting is `artifacts/red-noteboard-working/` in the CTO workspace. `kanban-Notes` and `markdown-Notes` were the two source ideas. They were not merged into one product repo. The hosted studio is the combine.

## Files

| File | Job |
|---|---|
| `index.html` | Shell: welcome card, top bar, left workspace drawer, canvas, inspector, notes, about |
| `styles.css` | RPS-like chrome: ink bar, gunmetal drawer, red accent, paper canvas |
| `app.js` | State, device frames, paint, templates, theme, exports |
| `themes/red-rtls-hmi-v1.json` | Example theme file |
| `themes/sample-dock.fixture.json` | Example local RTLS rows. `live_api` is false |
| `assets/RED_Logo_Canonical.png` | Mark in the bar |

## How a session starts

1. Welcome card. Name, device, theme (Light, Dark, Alt 1, Alt 2), grid on or off.
2. That writes `state` and hides the card.
3. Desktop frames cover the window, top-left. Phone and tablet frames are drawn whole, with bezel, on the paper.
4. Left drawer stays closed on a narrow screen so the canvas can boot. The workspace icon opens it.
5. **New project** (Project menu, or Workspace → Page) asks first, then clears screens, paint, widgets, notes, and the background on this device and shows the welcome card again. **New screen** only adds a page. Export before a new project if the current one should be kept.

## State

`session_title`, `deviceId`, `os` (`mac` | `windows` | `none`), `homeButton`, `gridSize`, `paperGridSize`, `layers`, `theme`, `pages`, `pieces`, `strokes`, `backgrounds`, `photos`.

One source of truth: that object. Export files are copies, not a second store.

## Device match

The scan icon asks first. If you agree, the page calls `navigator.userAgentData.getHighEntropyValues` when the browser has it. That is the permission step. If the browser blocks it, the page uses `screen.width`, `screen.height`, and the user agent string. It picks the closest frame in the list. It does not read files, photos, or location, and it does not know the hardware better than the browser does. Page → Phones / Tablets / Desktops still overrides it.

Desktop chrome is separate: Mac menu bar (top), Windows taskbar (bottom), or plain. Tablet home button is a circle on the bezel. Phones and tablets also get side buttons, a camera pill, and a home indicator when the home button is off.

## Grids

Screen grid is inside the device. Paper grid is the sheet around it. Each has its own toggle and size.

## Drawers and icons

| Icon | Does |
|---|---|
| Split panels | Workspace drawer |
| Folder | Project menu: new screen, notes, exports |
| Scan frame | Match this device |
| Four corners in | Fit |
| Curved arrow | Undo last stroke |
| Four corners out | Full screen |
| Sliders | Inspector |

The active icon is red and lifted. The two old marks were both three lines. They are not anymore.

## Templates

UI, buttons, text, cards, forms, lists, alerts. Click places on the frame. Drag places where you drop. Theme tokens (accent, paper, ink, card) come from the four built-in themes or from the wheel and mixer.

## What is not live

- No write to a Figma file. Handoff JSON is a file.
- No `POST /auth/login`, no bearer token, no `red_auth_token` in this page.
- Fixture rows are sample anchors and zones. They do not move.

## Ideal site calls, when a Connected slice is allowed

These exist on the RED API today. This page must not call them until a server path holds the token.

| Call | Body | Use |
|---|---|---|
| `POST /auth/login` | `{email, password}` | `{token, user}` |
| `GET /auth/me` | `Authorization: Bearer` | Who is in the room |
| `POST /auth/logout` | Bearer | End the demo sign-in |
| `POST /contact` | `{name, email, company?, note}` | Leave a note for the house |

A later HMI call, not built, would be a read of a named fixture (`site`, `devices[]`, `zones[]`) with `live_api: false` until a real feed is in scope. Do not put a tag stream or a key in this static file.

## Path so far

Welcome and full-bleed desktop. Device frames. Theme file. RTLS fixture file. Notebook layouts from the founder’s pages. Paint tools. Word and Markdown export. Mouse drag pans. A brush draws. Pen draws without arming a brush.

— CTO
