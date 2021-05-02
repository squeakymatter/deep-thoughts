const express = require('express');
//import ApolloServer:
const { ApolloServer } = require('apollo-server-express');
//import middleware function:
const { authMiddleware } = require('./utils/auth');
//import the `path` module
const path = require('path');

//import typeDefs and resolvers
const { typeDefs, resolvers } = require('./schema');

const db = require('./config/connection');

const PORT = process.env.PORT || 3001;
const app = express();

//with ApolloServer(), we provide typedefs and resolvers so they know what our API looks like and how it resolves requests.
//create new Apollo server and pass in data schema:
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware, //this ensures every request performs auth check and the updated request object will be passed to the resolvers as the `context`.
});

//integrate Apollo server with Express application as middleware - this creates a `/graphql` endpoint for the Express.js server that will serve as the main endpoing for accessing the entire API:
server.applyMiddleware({ app });

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//serve up React front-end code in prod:
//Serve up static assets:
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    // log where we can go to test our GQL API
    console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
  });
});
