const User = require('../../server/database/models/userSchema');

/**
 * Funtion to Signin User
 * @param {Request} req
 * @param {Response} res
 */
exports.todo = (req, res) => {
  // res.status(401).json({ msg: "Not authorized" });
  User.findById(req.user.id)
    .select('-password')
    .populate('todos')
    .exec((err, user) => {
      if (err) {
        return res.status(400).json({ msg: 'id not found' });
      }
      return res.status(200).json({ user });
    });
};
