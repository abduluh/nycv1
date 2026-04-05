# NYC Search App

High-trust NYC monthly rental search engine scaffold.

## What this is

This project is built around one rule:

`INGEST -> PARSE -> NORMALIZE -> DEDUPE -> VERIFY -> FILTER -> SCORE -> OUTPUT`

Listings that fail any blocking stage do not surface.

## Stack

- Backend: Node.js, TypeScript, Express
- Frontend: Next.js, React, TypeScript
- Database: Postgres
- Optional geocoding/commute: Mapbox or Google Maps APIs
- Search discovery: public-source adapters + configurable source registry

## Important note

This scaffold is designed to search **public listing pages and public search results** through adapter functions.
It does **not** assume every website permits scraping. Before using any source in production, review its robots.txt, Terms, and API policies.

## Repo structure

```text
apps/api     backend API and pipeline
apps/web     Next.js operator UI
packages/shared shared enums/contracts
sql          base schema
```

## Step by step: how the app works

### 1. User enters strict search constraints
The web app sends a request to `POST /search/run` with:
- move window
- minimum stay days
- max budget
- pet requirement
- target commute destinations
- max commute time

### 2. Ingestion starts
`search-runner.service.ts` calls source adapters from `source-registry.ts`.
Each adapter returns raw candidate records from public sources.

### 3. Parse stage
Each raw record is converted into the canonical listing schema.
Nothing is guessed. Unknown stays unknown.

### 4. Normalize stage
Text, URLs, arrays, and enum-like values are standardized.

### 5. Dedupe stage
Listings are clustered using:
- geo proximity
- title similarity
- price proximity
- optional image hash hook

Only one canonical listing survives per duplicate cluster.

### 6. Verify stage
Each canonical listing is checked live:
- HTTP 200
- listing-like page markers present
- not obviously removed/expired
- no dead redirect outcome

Only `VERIFIED_LIVE` and `PARTIAL` can continue.

### 7. Hard filter stage
The listing is rejected immediately if it fails any of these:
- not entire unit
- not fully furnished
- missing kitchen
- outside move window
- cannot support minimum stay
- above hard budget cap
- dead link

### 8. Commute stage
For survivors, commute is estimated using route/travel APIs or a fallback provider stub.
This is deliberately **not** straight-line distance.

### 9. Scoring stage
Only already-accepted listings are scored.
The score uses:
- budget fit
- commute fit
- freshness
- source trust
- unit quality
- pet fit
- fee clarity
- neighborhood tier

Penalties reduce weak listings.

### 10. Output stage
The API returns only surfaced listings with:
- score
- confidence
- why_selected
- risks
- last_verified_at
- sources
- commute summary
- effective cost

### 11. UI workflow
The frontend shows cards with:
- price
- effective cost
- neighborhood
- commute badge
- pet badge
- verification badge
- risk flags

The operator can:
- shortlist
- reject
- compare

## Local setup

### Backend
```bash
cd apps/api
npm install
cp .env.example .env
npm run dev
```

### Frontend
```bash
cd apps/web
npm install
npm run dev
```

### Database
Create a Postgres database, then run the SQL in `sql/schema.sql`.

## Production notes

To make this truly internet-searching and production usable, plug in:
- a compliant search provider API for discovery
- approved listing source APIs where available
- a route-time provider for commute estimates
- a background queue like BullMQ for ingestion/verification jobs
- a real image hashing pipeline for duplicate detection



## Fixes in this packaged version

- API shared-type imports were changed to direct relative imports so `npm run dev` works immediately inside `apps/api`.
- Mock verification now marks the built-in example.com seed listings as demo-verified, so the app shows accepted results on first run instead of rejecting everything as dead links.
- Frontend API base URL now reads `NEXT_PUBLIC_API_BASE_URL` when provided.

## Demo mode vs real public-source mode

This zip runs out of the box in **demo mode** using seeded public-source-shaped records.
It is the full pipeline and UI, but it does **not** scrape live listing marketplaces by default.
To move to real public-source search, plug compliant source adapters into `apps/api/src/services/ingest.service.ts` and use a real travel-time provider in `apps/api/src/services/commute.service.ts`.
