// import the gql tagged template function
//tagged templates are an advanced use of template literals introduced in ES6.

const { gql } = require('apollo-server-express');

//create our typeDefs in tagged template function.
//define a query using typeQuery {} data type, built into GraphQL. From here, you can define different types of queries by naming them.

//setup query to retrieve array of all the thought data from the database
//we can create custom typeDefs to define what we want to have returned from the query

// #define custom data type for thought
// #_id = unique identifier string
// #Int = integer

//in User type, user will return all the data in their Mongoose model
//friends field is an array that will be populated with data that also adheres to the `User` type as a user's friends should folow the same data pattern as the user
// notice `thoughts` field is an array of `Thought` types
const typeDefs = gql`
type User {
  _id: ID
  username: String
  email: String
  friendCount: Int
  thoughts: [Thought]
  friends: [User]
}
type Thought {
  _id: ID
  thoughtText: String
  createdAt: String
  username: String
  reactionCount: Int
  reactions: [Reaction]
}
type Reaction {
  _id: ID
  reactionBody: String
  createdAt: String
  username: String
}

  type Query {
    users: [User]
    user(username: String!): User
    thoughts(username: String): [Thought]
    thought(_id: ID!): Thought
  }
`;

//export the typeDefs
module.exports = typeDefs;
