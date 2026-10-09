# FundFlow

FundFlow is a MERN-stack startup discovery and investor-interest demo. Visitors can browse fictional early-stage startups, search and filter listings, view startup profiles, and send a non-binding message to express interest. The app does not process investments.

## Problem and solution

Early-stage founders and potential supporters can find it difficult to discover each other and start a conversation. FundFlow demonstrates a straightforward discovery experience: startups appear in a searchable marketplace, and visitors can send a message to ask to learn more.

All startup names and funding figures in the demo are fictional. Submitting an interest records a request to connect. It is not an investment or offer, and it does not guarantee a response.

## Features

- Browse startup listings loaded from the Express API.
- Search startup names, industries, and descriptions.
- Filter by industry, and combine an industry filter with search.
- Open a startup card to view its description, stage, funding goal, amount raised, and funding progress.
- Submit an investor-interest message with a name, email address, and short message.
- View loading, validation, error, and success states.
- Use responsive layouts and keyboard-accessible card and detail interactions.
- Check the API root and health endpoints.

Marketplace totals, company examples, and funding amounts are demonstration values, not real company or investment information.

## Technology

- **Frontend:** React (`^19.2.8`), Vite (`^8.3.0`), JavaScript, and CSS.
- **Backend:** Node.js, Express (`^5.2.1`), and JavaScript.
- **Database:** MongoDB, accessed through Mongoose (`^9.11.1`).
- **Testing and linting:** Node.js built-in test runner and ESLint.

The frontend uses the browser's `fetch` API. It does not use a UI component library or separate HTTP client package.

## Architecture

```text
Browser (React and Vite)
    |-- GET /api/startups?search=...&industry=...
    `-- POST /api/startups/:startupId/interests
                    |
                    v
              Express API
                    |
          routes -> controllers
                    |
            Mongoose models
                    |
                    v
                 MongoDB
```

The frontend sends API requests to `http://localhost:5000` by default. If the API uses a different address, set the public frontend variable `VITE_API_BASE_URL`. This variable is an API base URL, not a place for credentials or other secrets.

## Project structure

```text
FundFlow/
|-- client/
|   |-- index.html
|   |-- package.json
|   `-- src/
|       |-- App.jsx                 # Discovery page, detail dialog, interest form
|       |-- App.css
|       |-- index.css
|       `-- main.jsx                # React entry point
`-- server/
    |-- .env.example                # Environment-variable names only
    |-- package.json
    |-- app.js                      # Express app and route registration
    |-- index.js                    # Connects to MongoDB and starts HTTP server
    |-- config/
    |   `-- db.js                   # Mongoose connection configuration
    |-- controllers/
    |   |-- healthController.js
    |   |-- startupController.js
    |   `-- investorInterestController.js
    |-- models/
    |   |-- Startup.js
    |   `-- InvestorInterest.js
    |-- routes/
    |   |-- healthRoutes.js
    |   `-- startupRoutes.js
    |-- scripts/
    |   `-- seedStartups.js
    `-- test/
        |-- db.test.js
        |-- health.test.js
        |-- startups.test.js
        `-- interests.test.js
```

## Prerequisites

- Node.js 20.19+ or 22.12+, as required by Vite 8.
- npm.
- A MongoDB deployment and a connection URI that you provide privately.

The backend passes `MONGODB_URI` to Mongoose. This project does not specify the database name separately; the database used depends on the name or path in the connection URI you provide. No MongoDB URI or credentials are included in this README or the example environment file.

## Run locally on Windows

The commands below assume you begin in the repository root folder (`startupmeu-task`). Each PowerShell terminal has its own working directory.

### 1. Install backend dependencies

In PowerShell terminal 1, from the repository root:

```powershell
Set-Location .\server
npm install
```

### 2. Create and configure the backend environment file

In terminal 1, now in the `server` directory:

```powershell
Copy-Item .env.example .env
```

Open `server\.env` privately in a text editor and set `MONGODB_URI` to your own MongoDB connection URI. Do not paste credentials into source code, screenshots, issues, or chat. The `.env` file is ignored by Git.

The checked-in `server/.env.example` contains only these variable names:

```text
MONGODB_URI=
PORT=5000
```

### 3. Start the backend

In terminal 1, still in the `server` directory:

```powershell
npm run dev
```

The API uses port `5000` by default. Set `PORT` in your private server environment file to use a different port.

### 4. Install and start the frontend

Open PowerShell terminal 2. From the repository root:

```powershell
Set-Location .\client
npm install
npm run dev
```

Open the local URL printed by Vite. Keep both development servers running while using the app. The frontend fetches startup listings from the backend. If the backend or database is unavailable, the page shows an error and retry option instead of substituting local startup data.

## API

All endpoints below are served by the Express backend, which defaults to `http://localhost:5000`. Responses use JSON.

### `GET /`

Returns basic API status:

```json
{
  "message": "StartupMeu API is running!",
  "status": "success"
}
```

### `GET /api/health`

Returns health status and a generated timestamp:

```json
{
  "status": "healthy",
  "timestamp": "2026-01-01T12:00:00.000Z"
}
```

### `GET /api/startups`

Returns startup records sorted alphabetically by name:

```json
{
  "data": [
    {
      "id": "MongoDB document ID",
      "name": "Canopy",
      "industry": "Climate",
      "description": "Turning overlooked food waste into the next generation of sustainable materials.",
      "fundingGoal": 1200000,
      "amountRaised": 780000,
      "stage": "Seed"
    }
  ]
}
```

Optional query parameters:

- `search`: case-insensitive substring search across the startup name, industry, and description. Maximum length: 100 characters.
- `industry`: case-insensitive exact industry match. Maximum length: 80 characters.

The parameters can be combined:

```text
GET /api/startups?search=materials&industry=Climate
```

No matches return HTTP `200` with `{ "data": [] }`. Invalid or overlong query parameters return HTTP `400` with a safe `{ "error": { "message": "..." } }` response. Database errors return HTTP `500` with a generic error message.

### `POST /api/startups/:startupId/interests`

Records a request to contact the team associated with a startup. Send a JSON request body containing:

```json
{
  "name": "Alex Morgan",
  "email": "alex@example.test",
  "message": "I would like to learn more about your climate work."
}
```

Validation requires a valid MongoDB startup ID, a name between 2 and 100 characters, a valid email address, and a message between 10 and 1000 characters. The server trims the name and message, stores the email in lowercase, and rejects unknown request fields.

On success, the API returns HTTP `201`:

```json
{
  "data": {
    "id": "interest document ID",
    "startupId": "startup document ID",
    "name": "Alex Morgan",
    "email": "alex@example.test",
    "message": "I would like to learn more about your climate work.",
    "createdAt": "2026-01-01T12:00:00.000Z"
  }
}
```

Invalid IDs or request fields return HTTP `400`. A valid ID for a startup that does not exist returns HTTP `404`. Database failures return a generic HTTP `500` response. Internal errors and stack traces are not returned. An interest submission is only a request to connect; it does not execute an investment.

## Database models and demo data

- **Startup** stores `name`, `industry`, `description`, `fundingGoal`, `amountRaised`, and `stage`. Names are unique, required text values are trimmed, and funding amounts must be non-negative.
- **InvestorInterest** references a Startup and stores an investor's name, email, and message with timestamps. Its schema validates required fields, email format, and message length.

The seed script contains six fictional companies: Canopy, Northstar Health, Parcel, Morrow, Fieldnote, and Goodkind. It upserts records by unique startup name, inserting only missing records and leaving existing records unchanged.

Run the seed command only when you intend to insert these demo records into the database. In PowerShell, from the `server` directory with your private MongoDB configuration in place:

```powershell
npm run seed
```

The script reports an inserted count and does not print the connection URI.

## Tests and frontend checks

Run backend tests from the repository root:

```powershell
npm --prefix server test
```

API tests use fake or injected models and do not require a live MongoDB connection. They cover startup listing, search and filtering, investor-interest validation and errors, and the existing health routes.

Run frontend lint from the repository root:

```powershell
npm --prefix client run lint
```

Create a production frontend build from the repository root:

```powershell
npm --prefix client run build
```

To preview the production build, first build the frontend. Then, in PowerShell from the repository root:

```powershell
Set-Location .\client
npm run preview
```

## Limitations and future work

### Implemented

- Startup discovery, search, and industry filtering through MongoDB-backed API data.
- Startup detail dialog and stored investor-interest messages.
- Basic input validation and generic API error responses.
- A local seed command for fictional demo data.
- Automated API tests that do not need MongoDB.

### Not implemented

- Authentication, user accounts, or role-based access.
- Investment transactions, payments, securities handling, or actual offers.
- A real investor dashboard, investor analytics, or email notifications.
- Pagination, rate limiting, spam protection, or administrative review of interest submissions.
- Deployment configuration or production-readiness guarantees.

Possible future work includes authentication and authorization, rate limiting and spam controls for the public interest endpoint, pagination for startup listings, and a privacy-conscious workflow for reviewing contact requests. These are ideas for later, not current features.

## Code0 Usage

Completed project work with Code0 includes:

1. Inspecting the React/Vite starter and planning the FundFlow discovery page.
2. Organizing the Express backend and adding Mongoose connection configuration while preserving health routes.
3. Adding the Startup model, searchable listing API, and idempotent demo seed script.
4. Adding startup details and an investor-interest submission flow with offline backend tests.
5. Making the full startup card keyboard- and pointer-accessible, and documenting the project.

These items describe changes and task history in this repository. They do not imply deployment or live investment processing.

## Development experience (edit this section)

> **Personal reflection:** Replace this note with your own experience. You might describe which Code0 or AI-assisted tasks helped you understand or build FundFlow, what you reviewed or changed yourself, and what you learned. Keep only statements that reflect your genuine experience.
