import gql from 'graphql-tag';

// this query function can be used anywhere we need throughout the front end of the app.

export const QUERY_THOUGHTS = gql`
  query($username: String) {
    thoughts(username: $username) {
      _id
      thoughtText
      createdAt
      username
      reactionCount
      reactions {
        _id
        createdAt
        username
        reactionBody
      }
    }
  }
`;