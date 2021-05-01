const jwt = require('jsonwebtoken');

const secret = 'mysecretsshhhhh';
const expiration = '2h';

module.exports = {
  //generate token:
  //signToken() expects user object and add's user's `username`, `email` and `_id` properties to the token
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };
    // Optionally, tokens can be given an expiration date and a secret to sign the token with
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
  authMiddleware: function ({ req }) {
    //allows token to be sent via req.body, req.query, or headers:
    let token = req.body.token || req.query.token || req.headers.authorization;

    //separate "Bearer" from "<tokenvalue>"
    if (req.headers.authorization) {
      token = token.split(' ').pop().trim();
    }
    //if no token, return request object as is
    if (!token) {
      return req;
    }
    //wrap verify() method in a try... catch statement to mute the error so taht ti's not thrown on every request--Users with invalid token should still be able to request and see all thoughts.
    try {
      //decode and attach user data to request object
      // if secret on jwt.verify() doesn't match secret used with jwt.sign(), object won't be decoded. When JWT verification fails, throw error.
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
    } catch {
      console.log('Invalid token');
    }
    //return updated request object
    return req;
  },
};
