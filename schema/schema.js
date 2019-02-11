const graphql = require('graphql');
const Book = require('../models/Book.js');
const ElasticSearch = require('elasticsearch');

// connecting to ELS cluster
const client = new ElasticSearch.Client({
    host: process.env.ELS_URI,
    log: "trace"
});

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLList,
    GraphQLNonNull,
} = graphql;

/**
 * BookType Schema
 */
const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: {
            type: GraphQLID
        },
        title: {
            type: GraphQLString
        },
        description: {
            type: GraphQLString
        }
    })
});

const MutationType = new GraphQLObjectType({
    name: 'MutationType',
    fields: () => ({
        createBook: {
            type: BookType,
            args: {
                title: {
                    type: new GraphQLNonNull(GraphQLString)
                },
                description: {
                    type: new GraphQLNonNull(GraphQLString)
                }
            },
            async resolve(parent, args) {
                try {

                    return Book.build({
                        title: args.title,
                        description: args.description
                    }).save();

                } catch (error) {
                    console.trace(error.message);
                }

            }
        }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        books: {
            type: new GraphQLList(BookType),
            args: {},
            async resolve(parent, args) {
                try {
                    const response = await client.search({
                        index: 'books',
                        type: 'book'
                    });

                    const map = response.hits.hits.map(x => {
                        return x._source;
                    });

                    return map;

                } catch (error) {
                    console.trace(error.message);
                }
            }
        },
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: MutationType
});