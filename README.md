# Mable Audience Builder

A small full-stack application for creating an audience based on anonymous user events and previewing which users match the selected rules.

For example:

> Users who viewed a product at least twice in the last 7 days but did not purchase.

The project has a React frontend and a TypeScript/Express backend. The backend uses SQLite for the synthetic event data.

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- CSS

### Backend

- Node.js
- TypeScript
- Express
- SQLite
- Vitest

## Project Structure

```text
mable-audience-builder/
├── backend/
├── frontend/
├── DESIGN.md
└── AI_USAGE.md
├── README.md
└── .gitignore
```

## Prerequisites

You need:

- Node.js
- npm
- Git

Check your versions:

```bash
node --version
npm --version
git --version
```

## Running the Backend

Open a terminal:

```bash
cd backend
npm install
npm run dev
```

The API runs on:

```text
http://localhost:3000
```

You can check that the server is running with:

```text
GET http://localhost:3000/health
```

Expected response:

```json
{
  "status": "ok"
}
```

The SQLite database is initialized with synthetic events when the backend starts.

## Running the Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the URL shown by Vite, normally:

```text
http://localhost:5173
```

Make sure the backend is running at the same time.

## Running Tests

From the backend folder:

```bash
npm test
```

The tests currently cover the audience evaluator and request validation.

## How to Use the Application

1. Open the frontend.
2. Enter an audience name.
3. Add one or more conditions.
4. Select the event type.
5. Select the operator.
6. Enter the required event count.
7. Select the time window.
8. Click **Preview Audience**.
9. The frontend sends the rules to the backend.
10. The backend evaluates the rules against the SQLite event data.
11. The matching anonymous users and their event counts are displayed.

The frontend does not decide which users match. That logic stays in the backend.

## Example Rule

An example audience can be created with these two conditions:

```text
product_view
at least
2 events
within 7 days
```

and:

```text
purchase
exactly
0 events
within 7 days
```

This means:

Find users who viewed a product at least twice during the seven-day window and had no purchase during that same window.

##

## API

### `GET /health`

Used as a simple health check.

### `POST /v1/audiences/preview`

Example request:

```json
{
  "name": "Viewed but not purchased",
  "asOf": "2026-09-29T00:00:00.000Z",
  "conditions": [
    {
      "eventType": "product_view",
      "operator": "at_least",
      "count": 2,
      "withinDays": 7
    },
    {
      "eventType": "purchase",
      "operator": "exactly",
      "count": 0,
      "withinDays": 7
    }
  ]
}
```

The response contains the total number of matching users and evidence for each condition.

## Synthetic Data

The database only contains synthetic anonymous event data.

The supported event types are:

- `page_view`
- `product_view`
- `add_to_cart`
- `checkout_started`
- `purchase`

No real customer information, credentials, or payment information is used.

## Design Notes

Some of the implementation decisions are explained in:

```text
DESIGN.md
```

AI assistance used during development is documented in:

```text
AI_USAGE.md
```