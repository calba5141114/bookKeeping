require('dotenv').config();
const express = require('express');
const app = express();
const Book = require('./models/Book.js');
const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.MYSQL_URI);
const ElasticSearch = require('elasticsearch');
const graphqlHTTP = require('express-graphql');
const cors = require('cors');
const schema = require('./schema/schema.js');

/**
 * Connecting to ELS instance 
 */
const client = new ElasticSearch.Client({
    host: process.env.ELS_URI,
    log: "trace"
});

// connecting to MySQL instance 
sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
        Book.sync();
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

app.use(cors());


app.get('/', (req, res) => {
    res.json({
        Message: " Hello World 🌎 "
    });
});

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));


app.listen(process.env.PORT || 3000, () => {
    console.log("Application should be running on 3000 🧨")
});