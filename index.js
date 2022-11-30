const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.v0q5o0h.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

function verifyJWT(req, res, next) {

    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send('unauthorized access');
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, decoded) {
        if (err) {
            return res.status(403).send({ message: 'forbidden access' })
        }
        req.decoded = decoded;
        next();
    })

}

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
        app.get('/addproducts', verifyJWT, async (req, res) => {
            // const email = req.body.email;
            const decodedEmail = req.decoded.email;

            // if (email !== decodedEmail) {
            //     return res.status(403).send({ message: "forbidden access" })
            // }
            const query = {};
            const cursor = addProductsCollection.find(query);
            const products = await cursor.toArray();
            res.send(products)
        })

        //Add Products get by category
        app.get('/addproducts/:category', async (req, res) => {

            const query = { category: "Category" }
            const cursor = await addProductsCollection.findOne(query);
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

        // Get user information
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(result)
        })

        // all sellers
        app.get('/users/seller', async (req, res) => {
            const query = {};
            const seller = await usersCollection.find(query).toArray();
            const allSeller = seller.filter(sell => sell.account === 'seller');
            res.send(allSeller)
        })

        // all Buyers
        app.get('/users/buyer', async (req, res) => {
            const query = {};
            const buyer = await usersCollection.find(query).toArray();
            const allBuyer = buyer.filter(buy => buy.account === 'buyer');
            res.send(allBuyer)
        })

        // User
        app.get('/users/buyer/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email }
            const buyer = await usersCollection.findOne(query);
            res.send({ isBuyer: buyer?.account === 'buyer' });
        })

        // admin
        app.get('/users/admin/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email }
            const user = await usersCollection.findOne(query);
            res.send({ isAdmin: user?.account === 'admin' });
        })

        // Seller
        app.get('/users/seller/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email }
            const user = await usersCollection.findOne(query);
            res.send({ isSeller: user?.account === 'seller' });
        })

        app.get('/jwt', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            if (user) {
                const token = jwt.sign({ email }, process.env.ACCESS_TOKEN, { expiresIn: '1h' })
                return res.send({ accessToken: token });
            }
            res.status(403).send({ accessToken: '' })
        });

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