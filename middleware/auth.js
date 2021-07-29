require('dotenv').config();
const jwttoken = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.header('x-auth-token');

  //Check for token
  if (!token) {
    return res.status(401).json({ msg: 'No token, Not authorized' });
  }

  try {
    //Verify Token
    const decoded = jwttoken.verify(token, process.env.JWT_SECRET);

    //Add user from payload
    req.user = decoded;
    next();
  } catch (e) {
    res.status(400).json({ msg: 'Token Expired' });
  }
};

module.exports = auth;
