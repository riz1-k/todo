const User = require('../database/models/userSchema');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const jwt = require('jsonwebtoken');

exports.login = (req, res) => {
  const { userName, password } = req.body;

  //simple validation
  if ((!userName, !password)) {
    return res.status(400).json({ msg: 'fill the required fields' });
  }

  //check for existing user
  User.findOne({ userName }).then(user => {
    if (!user) {
      console.log('exists');
      return res.status(400).json({ msg: 'User doesnt exist' });
    }

    //validate passwords
    bcrypt
      .compare(password, user.password)
      .then(isMatch => {
        if (!isMatch)
          return res.status(400).json({ msg: 'Invalid credentials' });

        jwt.sign(
          { id: user.id },
          process.env.JWT_SECRET,
          { expiresIn: 3600 },
          (err, token) => {
            if (err) throw err;
            res.status(200).json({
              token,
              user: { id: user.id, userName: user.userName },
            });
          }
        );
      })
      .catch(err => {
        console.log(err);
      });
  });
};

exports.signup = (req, res) => {
  const { userName, email, password } = req.body;

  if ((!userName, !email, !password)) {
    return res.status(400).json({ msg: 'fill the required fields' });
  }

  //check for existing user
  User.findOne({ email }).then(email => {
    if (email) {
      res.status(400).json({ msg: 'Email already exists' });
    }
    //create new user
    const newUser = new User({ userName, email, password });
    //create salt and hash
    console.log(newUser.password + 'pass');
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        console.log(hash + 'hash');
        console.log(salt + 'salt');
        newUser.save().then(user => {
          jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET,
            { expiresIn: 3600 },
            (err, token) => {
              if (err) throw err;
              res.status(200).json({
                token,
                user: { id: user.id, userName: user.userName },
              });
            }
          );
        });
      });
    });
  });
};
