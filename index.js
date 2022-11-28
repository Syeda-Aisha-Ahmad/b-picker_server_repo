const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

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

        // Home page categories
        app.get('/categories', async (req, res) => {
            const query = {};
            const cursor = categoryCollection.find(query);
            const category = await cursor.toArray();
            res.send(category)
        })

        // Add Products 
        app.post('/addproducts', async (req, res) => {
            const query = req.body;
            const result = await addProductsCollection.insertOne(query);
            res.send(result);
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