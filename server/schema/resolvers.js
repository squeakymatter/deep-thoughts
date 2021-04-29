const { User, Thought } = require('../models');

// perform find() method on Thought model and return thought data in descending order (sort() method) - error handling is done by Apollo. Open graphQL playground to query thoughts data

// pass in the `parent as a placeholder parameter. it's not used but we need to put something there wo we can access the username argument in second parameter

// Use terniary operator to check of username exists. If exists, set params to an object with the username key set to that value. If does not exist, return empty object.

//   then pass that object (with or without any data in it) to .find() method. if data exits, it performs a lookupby specific username. if no, it returns every thought.
//test in graphQL playground

const resolvers = {
  Query: {
    thoughts: async (parent, { username }) => {
      const params = username ? { username } : {};
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
    }
  },
};

module.exports = resolvers;
