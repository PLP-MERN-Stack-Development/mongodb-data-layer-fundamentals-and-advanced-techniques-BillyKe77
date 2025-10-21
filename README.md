# Run the queries script

This file explains how to run the [queries.js](queries.js) script in this workspace.

Prerequisites
- Node.js installed (v18+ recommended)
- MongoDB running locally or an Atlas connection string
- The `mongodb` driver installed (see Setup)

Important workspace files
- [queries.js](queries.js) — main script that runs queries and index demos. Exposed functions: [`runQueries`](queries.js), [`runAdvancedQueries`](queries.js), [`runAggregation`](queries.js), [`createIndexes`](queries.js), and [`main`](queries.js).
- [insert_books.js](insert_books.js) — helper script to seed the `plp_bookstore` DB before running queries.
- [package.json](package.json) — project metadata and scripts.

Setup
1. Install dependencies:
```sh
npm install