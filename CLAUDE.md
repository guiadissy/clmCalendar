# CLM_Calendar — Project Context for Claude

## Overview

CLM_Calendar is a data pipeline and sync tool that:
1. Fetches event data from an **external REST API** (source TBD)
2. Persists that data in a **local MongoDB database**
3. **Exports events to Google Calendar** so they are publicly accessible
4. Sync is **manually triggered** via the UI or a backend API endpoint

## Tech Stack

| Layer       | Technology                        |
|-------------|-----------------------------------|
| Frontend    | React                             |
| Backend     | Node.js + Express                 |
| Database    | MongoDB (via Mongoose)            |
| Source data | Circuito Liga Magic REST API      |
| Destination | Google Calendar API (OAuth2)      |

## Folder Structure

```
CLM_Calendar/
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/      # UI components
│   │   ├── pages/           # Page-level views
│   │   └── App.jsx
│   └── package.json
├── server/                  # Node.js + Express backend
│   ├── config/              # Environment/config loading
│   ├── models/              # Mongoose schemas/models
│   ├── routes/              # Express route handlers
│   ├── services/            # Business logic
│   │   ├── externalApi.js   # Fetch events from source API
│   │   └── googleCalendar.js# Push events to Google Calendar
│   └── index.js             # Server entry point
├── .env                     # Local secrets (not committed)
├── .env.example             # Template for required env vars
├── CLAUDE.md                # This file
└── README.md
```

## External API Endpoints

### Circuito Liga Magic
Base URL: `https://lightning-bolt.circuitoligamagic.com.br`

| Endpoint | Description |
|----------|-------------|
| `GET /v2/all-tournaments?city={city}&store={store}&format={format}&date={YYYY-MM-DD}` | List tournaments filtered by city, store, format, and date |
| `GET /seasons/{seasonId}/stores` | List stores participating in a given season |

### Brazil Cities
| URL | Description |
|-----|-------------|
| `https://raio.dev.br/assets/brazil-cities-complete-aa532259.js` | Static JS file containing Brazilian cities (used to populate city filter) |

### Tournament Formats
| ID | Name |
|----|------|
| 1  | Standard |
| 3  | Modern |
| 9  | Duel Commander |
| 14 | Limitado |
| 15 | Pauper |
| 20 | Premodern |
| 21 | Pioneer |
| 31 | Dual Commander 500 |

## Key Workflows

### 1. Fetch & Store
```
User triggers sync →
  server/services/externalApi.js fetches tournaments from Circuito Liga Magic API →
  events upserted into MongoDB via Mongoose model →
  response returned to client
```

### 2. Export to Google Calendar
```
User triggers export →
  server/services/googleCalendar.js reads events from MongoDB →
  events pushed to Google Calendar via Google Calendar API →
  response returned to client
```

## Environment Variables

```env
# External source API (Circuito Liga Magic)
SOURCE_API_BASE_URL=https://lightning-bolt.circuitoligamagic.com.br
# Tournaments endpoint: /v2/all-tournaments?city={city}&store={store}&format={format}&date={YYYY-MM-DD}
# Stores endpoint:      /seasons/{seasonId}/stores
SOURCE_API_KEY=         # Auth key/token if required (TBD)

# Brazil cities list (used to populate city filter)
CITIES_JS_URL=https://raio.dev.br/assets/brazil-cities-complete-aa532259.js

# MongoDB
MONGODB_URI=mongodb://localhost:27017/clm_calendar

# Google Calendar OAuth2
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=
GOOGLE_REFRESH_TOKEN=
GOOGLE_CALENDAR_ID=    # Target calendar ID

# Server
PORT=3001
```

## Conventions

- **camelCase** for variables and functions; **PascalCase** for React components and Mongoose models
- Async/await preferred over `.then()` chains
- Keep route handlers thin — business logic lives in `services/`
- MongoDB documents should include `createdAt` and `updatedAt` (use Mongoose `timestamps: true`)
- React components in `.jsx`, backend modules in `.js`
- No magic strings — use constants or env vars

## Known Gaps / TODO

- [ ] Confirm if Circuito Liga Magic API requires authentication
- [ ] Document full response schema after inspecting API response
- [ ] Define which query params (`city`, `store`, `format`) will be configurable vs hardcoded
- [ ] Google Calendar OAuth2 flow needs to be set up (token generation)
- [ ] Decide whether to use a specific Google Calendar library (`googleapis` npm package recommended)
- [ ] Frontend design/wireframes not yet defined
