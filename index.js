const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// database connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9tg9f.mongodb.net/${process.env.DB_HOST}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

console.log(uri);

async function run() {
  try {
    await client.connect();
    console.log("Database Connected Successfully");

    const database = client.db("onlineShop");
    const productsCollection = database.collection("products");

    // get products api
    app.get("/products", async (req, res) => {
      // setting cursor
      const cursor = productsCollection.find({});
      const page = parseInt(req.query.page);
      const size = parseInt(req.query.size);

      const count = await cursor.count();
      let products;

      if (page >= 0) {
        products = await cursor
          .skip(page * size)
          .limit(size)
          .toArray();
      } else {
        products = await cursor.toArray();
      }

      res.send({ products, count });
    });

    //     use post to data by keys
    app.post("/products/byKeys", async (req, res) => {
      console.log("I am here");
      console.log(req.body);
      res.send("Hitting POST");
    });
  } finally {
    //   await client.close();
  }
}

run().catch(console.dir);

app.get("/", async (req, res) => {
  await res.send("Ema John Server");
});

app.listen(port, () => {
  console.log("Running on port: ", port);
});
