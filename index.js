const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.q0pfb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const app = express();
app.use(bodyParser.json());
app.use(cors());
const port = 5000;
console.log(process.env.DB_CONNECTED)



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
          const collection = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_CONNECT}`);
          const orderCollection = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_CONNECTED}`);
          console.log("database connection successfully")
          app.post('/addProduct', (req, res) => {
                    const product = req.body;
                    console.log(product)
                    collection.insertMany(product)
                    .then(result =>{
                              console.log(result.acknowledged);
                              res.send(result.acknowledged === true );

                    })
          });


          app.post('/addOrder', (req, res) => {
                    const order = req.body;
                    console.log(order)
                    orderCollection.insertOne(order)
                    .then(result =>{
                              console.log(result)
                              res.send(result.acknowledged === true );

                    })
          });

          app.get('/products', (req, res) => {
                    collection.find({})
                    .toArray((err, documents)=>{
                              res.send(documents);
                    })
          });

          app.get('/product/:key', (req, res) => {
                    collection.find({key: req.params.key})
                    .toArray((err, documents)=>{
                              res.send(documents[0]);
                    })
          });

          app.post('/productsByKeys', (req, res) => {
                    const productKeys = req.body;
                    collection.find({key : {$in : productKeys}})
                    .toArray((err, documents)=>{
                              res.send(documents);
                    })
          })
});


app.get('/', (req, res) => {
          res.send('Hello World WatSon')
})

app.listen(port);