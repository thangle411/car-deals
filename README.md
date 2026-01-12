# Car Deals Repository

A browser extension + Express server system for automated car deal scraping and aggregation.

## Architecture

### `car-deals-ext` (Browser Extension - Manifest V3)

- Automatically scrapes car listings from CarGurus and AutoTrader every 12 hours
- Uses content scripts to extract pricing, titles, and specifications from search results
- Background service worker orchestrates tab creation, scraping, and data submission
- Sends scraped data to local server via POST requests

### `car-deals-server` (Express/TypeScript API)

- Receives scraped car data via `/submit` endpoint
- Stores daily snapshots in JSON files organized by date (`data-YYYY-MM-DD.json`)
- Prevents duplicate entries for the same hostname on the same day
- Built with TypeScript, runs on port 3000

## Key Features

- ✅ Automated scraping of hybrid/electric vehicle deals
- 💰 Price sorting and parsing
- 📁 Daily data persistence with deduplication
- 🔇 Non-intrusive background operation (pinned, inactive tabs)

TODO:
- [ ] Add price sorting and parsing
- [ ] Add daily data persistence with deduplication
- [ ] Add more car dealerships
- [ ] Use extension popup to allow for user input of search parameters
- [ ] Scarpe VIN if possible, use VIN for hash to prevent duplicates + data analysis in the future