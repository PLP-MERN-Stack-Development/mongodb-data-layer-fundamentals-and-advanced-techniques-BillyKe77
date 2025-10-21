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

** Provide a MongoDB connection string via an environment variable MONGODB_URI 
Create a .env file in the project root with contents like:

MONGODB_URI=mongodb://localhost:27017
(or use your Atlas connection string)

Notes:
** The script in queries.js uses the constants dbName (default: plp_bookstore) and collectionName (default: books) to connect and run queries. Adjust those in the file if needed 

** Seeding the database (optional but recommended) 

Run the seed script to insert sample books:
node [insert_books.js](http://_vscodecontentref_/0)


** Run the queries script
To run all queries and index operations:

node [queries.js](http://_vscodecontentref_/1)

# The script connects using process.env.MONGODB_URI, runs runQueries, runAdvancedQueries, runAggregation, and createIndexes via main. Output will print to the console.
** Troubleshooting

Error: "MONGODB_URI is not defined" — ensure .env exists and you started the shell session that loads it, or export MONGODB_URI in your environment.
# If MongoDB is not reachable, verify the server is running and the connection string is correct.
# If data looks missing, re-run node insert_books.js to reseed the collection.
Quick commands
# install deps
npm install

# seed sample data
node [insert_books.js](http://_vscodecontentref_/2)

# run queries
node [queries.js](http://_vscodecontentref_/3)


