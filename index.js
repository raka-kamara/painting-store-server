const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lentaxi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const paintingCollection = client.db("paintingDB").collection("painting");
    const categoryCollection = client.db("paintingDB").collection("category");

    app.get("/painting", async (req, res) => {
      const cursor = paintingCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/category", async (req, res) => {
      const cursor = categoryCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // reading with email
    app.get("/myPainting/:email", async (req, res) => {
      console.log(req.params.email);
      const result = await paintingCollection
        .find({ email: req.params.email })
        .toArray();
      res.send(result);
    });

    // get with id
    app.get("/singleProduct/:id", async (req, res) => {
      const result = await paintingCollection.findOne({
        _id: new ObjectId(req.params.id),
      });
      res.send(result);
    });

    // get with id category
    app.get("/singleCategory/:id", async (req, res) => {
      const result = await categoryCollection.findOne({
        _id: new ObjectId(req.params.id),
      });
      res.send(result);
    });

    app.put("/updateProduct/:id", async (req, res) => {
      const query = { _id: new ObjectId(req.params.id) };
      const data = {
        $set: {
          name: req.body.name,
          price: req.body.price,
          rating: req.body.rating,
          customization: req.body.customization,
          stock: req.body.stock,
          photo: req.body.photo,
        },
      };
      const result = paintingCollection.updateOne(query, data);
      console.log(result);
      res.send(result);
    });

    
    // Delete
    app.delete("/painting/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await paintingCollection.deleteOne(query);
      res.send(result);
    });

    app.post("/painting", async (req, res) => {
      const newPainting = req.body;
      console.log(newPainting);
      const result = await paintingCollection.insertOne(newPainting);
      res.send(result);
    });

    app.post("/category", async (req, res) => {
      const newcategory = req.body;
      console.log(newcategory);
      const result = await categoryCollection.insertOne(newcategory);
      res.send(result);
    });

    // user's api
    app.post("/user", async (req, res) => {
      const user = req.body;
      console.log(user);
      const result = await userCollection.insertOner(user);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Painting store server is running");
});

app.listen(port, () => {
  console.log(`painting store server is running on port: ${port}`);
});
