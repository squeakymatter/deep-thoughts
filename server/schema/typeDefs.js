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
    me: User
    users: [User]
    user(username: String!): User
    thoughts(username: String): [Thought]
    thought(_id: ID!): Thought
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    addThought(thoughtText: String!): Thought
    addReaction(thoughtId: ID!, reactionBody: String!): Thought
    addFriend(friendId: ID!): User
  }
  type Auth {
    token: ID!
    user: User
  }
`;

//define two mutations you app supports: login() and addUser().
//the ! in String! means it's a required argument. A user can't be created without entering a username, email, and password.

//Both return a User object: either the user who logged in or the user who was just created on signup.

//type Auth: Auth type must return a token and can optionally include other user data. after adding Auth type, update the two mutation soto return an Auth object instead of User object.

//addReaction() retunrs the parent Thought instead of the newly created Reaction because the front end will ultimately track changes on the thought level, not the reaction level.

//export the typeDefs
module.exports = typeDefs;
