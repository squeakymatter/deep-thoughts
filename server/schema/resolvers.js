const { User, Thought } = require('../models');
const { AuthenticationError } = require('apollo-server-express');

//   then pass that object (with or without any data in it) to .find() method. if data exits, it performs a lookup by specific username. if no, it returns every thought.
//test in graphQL playground

//import signToken() function:
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({})
          .select('-__v -password')
          .populate('thoughts')
          .populate('friends');

        return userData;
      }
      throw new AuthenticationError('Not logged in.');
    },
    //perform find() method on Thought model and return thought data in descending order (sort() method) - error handling is done by Apollo. Open graphQL playground to query thoughts data
    // pass in the `parent` as a placeholder parameter. it's not used but we need to put something there wo we can access the username argument in second parameter
    thoughts: async (parent, { username }) => {
      // Use terniary operator to check of username exists. If exists, set params to an object with the username key set to that value. If does not exist, return empty object.
      const params = username ? { username } : {};
      // then pass that object (with or without any data in it) to .find() method. if data exits, it performs a lookupby specific username. if no, it returns every thought.
      return Thought.find(params).sort({ createdAt: -1 });
    },
    // destructure the _id argument value and place it into .findOne() method to look up a single thought by its id.
    thought: async (parent, { _id }) => {
      return Thought.findOne({ _id });
    },
    // get all users
    users: async () => {
      return User.find()
        .select('-__v -password')
        .populate('friends')
        .populate('thoughts');
    },
    // get a user by username
    user: async (parent, { username }) => {
      return User.findOne({ username })
        .select('-__v -password')
        .populate('friends')
        .populate('thoughts');
    },
  },
  //Mutations defined in typeDefs.js. Add separate `Mutation` property:
  Mutation: {
    // addUser resolver
    // Mongoose user model creates a new user in the database with whatever is passed in as the arguments (args)
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user); //sign token
      return user;
    },
    //login resolver - be sure to require the AuthenticationError from apollo-server-express first. test the login mutation in GraphQL Playground.
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }
      const token = signToken(user);
      return { token, user }; //return an object that combines token with user's data;
    },
    addThought: async (parent, args, context) => {
      if (context.user) {
        const thought = await Thought.create({
          ...args,
          username: context.user.username,
        });

        await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $push: { thoughts: thought._id } },
          { new: true }
        ); //without this flag set to true, Mongo would return the original document instead of the updated document

        return thought;
      }
      throw new AuthenticationError('You need to be logged in!');
    },
// reactions are stored as arrays on the `Thought` model, so use Mongo $push operator.
//we're updating existing thought so client will need to provide corresponding thoughtId.
    addReaction: async (parent, { thoughtId, reactionBody }, context) => {
      if (context.user) {
        const updatedThought = await Thought.findOneAndUpdate(
          { _id: thoughtId },
          { $push: { reactions: { reactionBody, username: context.user.username } } },
          { new: true, runValidators: true }
        );
    
        return updatedThought;
      }
    
      throw new AuthenticationError('You need to be logged in!');
    },
    //look for incoming `friendId` and add that to the current user's friends array.
    // User can't be friends with the same person twice, so add `$addToSet` operator instead of `$push` to prevent dupes
    addFriend: async (parent, { friendId }, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { friends: friendId } },
          { new: true }
        ).populate('friends');
    
        return updatedUser;
      }
    
      throw new AuthenticationError('You need to be logged in!');
    }
  },
};

module.exports = resolvers;
