const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.MYSQL_URI);
const ElasticSearch = require('elasticsearch');

// connecting to ELS 
const client = new ElasticSearch.Client({
    host: "localhost:9200",
    log: "trace"
});

client.indices.create({
    index: 'books'
}, (err, resp, status) => {
    if (err) {
        console.log(err);
    } else {
        console.log("create", resp);
    }
});

/**
 * Book model
 */
const Book = sequelize.define('book', {
    title: {
        type: Sequelize.TEXT
    },
    description: {
        type: Sequelize.TEXT
    }
});

Book.sync({
        force: true
    })
    .then(() => {
        console.log("Sync");
        // return Book
        //     .create({
        //         title: "Hello World 🐳",
        //         description: "Example Book for API",
        //     });
    });



/**
 * Saves data to ELS cluster 
 */
Book.afterCreate(async (book, options) => {
    const document = book.toJSON();
    // upload to ELS Cluster
    return client.index({
        index: 'books',
        id: book.id,
        type: "book",
        body: document
    }, (err, resp, status) => {
        if (err) {
            console.log(err);
        }
    });

});

/**
 * Destroys data from ELS Cluster
 */
Book.afterDestroy(async (book, options) => {
    return client.documents.destroy({
        id: book.id
    });
});



module.exports = Book;