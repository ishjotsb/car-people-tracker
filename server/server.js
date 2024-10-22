const express = require('express');
const {ApolloServer} = require('apollo-server-express');
const app = express();
const port = 4000;

const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');

const startApolloServer = async () => {
    const server = new ApolloServer({typeDefs, resolvers});
    await server.start();
    server.applyMiddleware({app, path: '/graphql'});

    app.listen(port, (req, res) => {
        console.log(`Server running on port: ${port}`);
    })
}

startApolloServer();
