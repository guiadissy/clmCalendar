# CLM Calendar

A data pipeline and sync tool that fetches Magic: The Gathering tournament data from the Circuito Liga Magic API, stores it in a local MongoDB database, and exports events to Google Calendar.

## Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/try/download/community) v6+

## Setup

### 1. Clone and configure environment

```bash
cp .env.example .env
```

Fill in the required values in `.env` (Google OAuth2 credentials, etc.).

### 2. Install dependencies

```bash
# Backend
cd server && npm install

# Frontend
cd client && npm install
```

## Running Locally

### Database

Install and start MongoDB locally:

```bash
# macOS (Homebrew)
brew services start mongodb-community

# Linux (systemd)
sudo systemctl start mongod

# Windows
# Start the MongoDB service from Services or run:
net start MongoDB
```

MongoDB will be available at `mongodb://localhost:27017` by default. The app uses the `clm_calendar` database, which is created automatically on first use.

### Backend

```bash
cd server
npm run dev
```

The API server runs on `http://localhost:3001`.

### Frontend

```bash
cd client
npm start
```

The React app runs on `http://localhost:3000`.
