const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;
// middle wares 
app.use(cors())
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.8nnhhq6.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const truckCollection = client.db('Sunshine').collection('trucks');
        const HomeServiceCollection = client.db('Sunshine').collection('homeService');
        const reviewCollection = client.db('Sunshine').collection('reviews');
        app.get('/services', async (req, res) => {
            const query = {}
            const cursor = truckCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });
        app.get('/homeservice', async (req, res) => {
            const query = {}
            const cursor = HomeServiceCollection.find(query);
            const homeServices = await cursor.toArray();
            res.send(homeServices);
        });
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const services = await truckCollection.findOne(query);
            res.send(services);
        });

        // review 
        app.get('/reviews', async (req, res) => {
            // console.log(req.query.service);
            let query = {};
            console.log(req.query.email);
            if (req.query.service) {
                query = {
                    service: req.query.service
                }
            }
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const cursor = reviewCollection.find(query);

            const reviews = await cursor.toArray();
            res.send(reviews);
        })
        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result);
        });
        app.get('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const services = await reviewCollection.findOne(query);
            res.send(services);
        });
        app.delete('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await reviewCollection.deleteOne(query);
            res.send(result);
        })
    }
    finally {

    }
}
run().catch(err => console.error(err));

app.get('/', (req, res) => {
    res.send('Sunshine server is running');
})

app.listen(port, () => {
    console.log(`Sunshine logistic running on ${port}`);
})