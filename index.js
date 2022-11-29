const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.v0q5o0h.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const categoryCollection = client.db('b-picker').collection('categories');
        const addProductsCollection = client.db('b-picker').collection('addProducts');
        const advertiseCollection = client.db('b-picker').collection('advertise');
        const usersCollection = client.db('b-picker').collection('users');

        // Home page categories
        app.get('/categories', async (req, res) => {
            const query = {};
            const cursor = categoryCollection.find(query);
            const category = await cursor.toArray();
            res.send(category)
        })

        // Add Products post
        app.post('/addproducts', async (req, res) => {
            const query = req.body;
            const result = await addProductsCollection.insertOne(query);
            res.send(result);
        })

        //Add Products get
        app.get('/addproducts', async (req, res) => {
            const query = {};
            const cursor = addProductsCollection.find(query);
            const products = await cursor.toArray();
            res.send(products)
        })

        //Add Products get
        app.get('/addproducts/:category', async (req, res) => {

            const query = { category: "Category" }
            const cursor = await addProductsCollection.findOne(query);
            // const products = await cursor.toArray();
            res.send(cursor)
        })

        //Delete my products
        app.delete('/addproducts/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const result = await addProductsCollection.deleteOne(filter);
            res.send(result);
        })

        // Advertise product post
        app.post('/advertise', async (req, res) => {
            const filter = req.body;
            const result = await advertiseCollection.insertOne(filter);
            res.send(result);
        })

        // Advertise product get
        app.get('/advertise', async (req, res) => {
            const query = {};
            const cursor = advertiseCollection.find(query);
            const products = await cursor.toArray();
            res.send(products)
        })

        //Delete my products
        app.delete('/advertise/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const result = await advertiseCollection.deleteOne(filter);
            res.send(result);
        })

        // Save user information
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(result)
        })

    }

    finally { }
}
run().catch(console.log);


app.get('/', (req, res) => {
    res.send('running port')
})
app.listen(port, () => {
    console.log('port')
})