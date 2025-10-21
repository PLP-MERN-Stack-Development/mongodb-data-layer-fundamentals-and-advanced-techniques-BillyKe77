// Addition of more books to the bookstore collection
require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const dbName = 'plp_bookstore';
const collectionName = 'books';

const client = new MongoClient(uri);

async function runQueries(db) {
  const books = db.collection(collectionName);

  // 1️⃣ Find all books in a particular genre
  const genre = 'Science Fiction';
  const booksByGenre = await books.find({ genre }).toArray();
  console.log('Books in genre:', booksByGenre);

  // 2️⃣ Find all books published after a certain year
  const year = 2015;
  const recentBooks = await books.find({ publishedYear: { $gt: year } }).toArray();
  console.log('Books published after', year, ':', recentBooks);

  // 3️⃣ Find books by a certain author
  const author = 'F. Scott Fitzgerald';
  const booksByAuthor = await books.find({ author }).toArray();
  console.log('Books by author:', booksByAuthor);

  // 4️⃣ Update the price of a specific book
  const titleToUpdate = 'Kindred';
  const newPrice = 18.99;
  const updateResult = await books.updateOne(
    { title: titleToUpdate },
    { $set: { price: newPrice } }
  );
  console.log('Price update result:', updateResult);

  // 5️⃣ Delete a book by its title (use straight apostrophe)
  const titleToDelete = "Old Man's War";
  const deleteResult = await books.deleteOne({ title: titleToDelete });
  console.log('Delete result:', deleteResult);
}

async function runAdvancedQueries(db) {
  const books = db.collection(collectionName);

  // 1️⃣ Find books that are in stock and published after 2010
  const inStockAndRecent = await books.find(
    { inStock: true, publishedYear: { $gt: 2010 } },
    { projection: { title: 1, author: 1, price: 1, _id: 0 } }
  ).toArray();
  console.log('📘 In-stock books published after 2010:', inStockAndRecent);

  // 2️⃣ Sort books by price ascending
  const sortedAsc = await books.find(
    {},
    { projection: { title: 1, author: 1, price: 1, _id: 0 } }
  ).sort({ price: 1 }).toArray();
  console.log('⬆️ Books sorted by price (ascending):', sortedAsc);

  // 3️⃣ Sort books by price descending
  const sortedDesc = await books.find(
    {},
    { projection: { title: 1, author: 1, price: 1, _id: 0 } }
  ).sort({ price: -1 }).toArray();
  console.log('⬇️ Books sorted by price (descending):', sortedDesc);

  // 4️⃣ Pagination: 5 books per page
  const page = 2;
  const booksPerPage = 5;
  const paginatedBooks = await books.find(
    {},
    { projection: { title: 1, author: 1, price: 1, _id: 0 } }
  )
  .skip((page - 1) * booksPerPage)
  .limit(booksPerPage)
  .toArray();
  console.log(`📄 Page ${page} of books:`, paginatedBooks);
}

async function runAggregation(db) {
  const books = db.collection(collectionName);

  // Average price by genre
  const avgPriceByGenre = await books.aggregate([
    {
      $group: {
        _id: "$genre",
        averagePrice: { $avg: "$price" }
      }
    },
    {
      $sort: { averagePrice: -1 }
    }
  ]).toArray();
  console.log("Average price by genre:", avgPriceByGenre);

  // Author with most books
  const topAuthorArr = await books.aggregate([
    {
      $group: {
        _id: "$author",
        bookCount: { $sum: 1 }
      }
    },
    {
      $sort: { bookCount: -1 }
    },
    {
      $limit: 1
    }
  ]).toArray();
  console.log("Author with most books:", topAuthorArr[0] || null);

  // Grouping books by decade and counting
  const booksByDecade = await books.aggregate([
    {
      $addFields: {
        decade: {
          $concat: [
            { $toString: { $multiply: [{ $floor: { $divide: ["$publishedYear", 10] } }, 10] } },
            "s"
          ]
        }
      }
    },
    {
      $group: {
        _id: "$decade",
        count: { $sum: 1 }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ]).toArray();
  console.log("Books grouped by decade:", booksByDecade);
}

//Indexing for performance optimization

async function createIndexes(db) {
  const books = db.collection(collectionName);

  // show existing indexes
  console.log('Existing indexes:', await books.indexes());

  // explain before creating index (baseline)
  const noIndexExplain = await books.find({ title: "Kindred" }).explain("executionStats");
  console.log("Explain before creating index:", noIndexExplain.executionStats);

  // create indexes with explicit names
  await books.createIndex({ title: 1 }, { name: 'idx_title' });
  console.log('Index created: idx_title on { title: 1 }');

  await books.createIndex({ author: 1, publishedYear: -1 }, { name: 'idx_author_publishedYear' });
  console.log('Index created: idx_author_publishedYear on { author: 1, publishedYear: -1 }');

  // explain after creating indexes
  const withIndexExplain = await books.find({ title: "Kindred" }).explain("executionStats");
  console.log("Explain after creating index:", withIndexExplain.executionStats);

  // demonstrate forcing the title index with hint
  const hintExplain = await books.find({ title: "Kindred" }).hint('idx_title').explain("executionStats");
  console.log("Explain using hint 'idx_title':", hintExplain.executionStats);
}


async function main() {
  try {
    await client.connect();
    const db = client.db(dbName);

    await runQueries(db);
    await runAdvancedQueries(db);
    await runAggregation(db);
    await createIndexes(db);
  } catch (err) {
    console.error('Error occurred:', err);
  } finally {
    await client.close();
  }
}

main().catch(err => console.error(err));



