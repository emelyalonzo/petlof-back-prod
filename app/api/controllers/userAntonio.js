const registerUser = async (req, res, next) => {
    try {
      const newUser = new User(req.body);
      const userDuplicate = await User.findOne({ username: newUser.username });
      if (userDuplicate) {
        return next("Existing user");
      }
      const userDB = await newUser.save();

    //   const token = jwt.sign(insertedUser, sanitiziedEmail, {
    //     expiresIn: 60 * 24,
    // })

      return res.status(201).json(userDB);
    } catch (error) {
      return next(error);
    }
  };

// const jwt = require("jsonwebtoken");

// const generateSign = (id, username) => {
//   return jwt.sign({ id, username }, process.env.JWT_SECRET, {
//     expiresIn: "1d",
//   });
// };

// const verifyJwt = (token) => {
//   return jwt.verify(token, process.env.JWT_SECRET);
// };

// module.exports = { generateSign, verifyJwt };
  
  const loginUser = async (req, res, next) => {
    try {
      const userDB = await User.findOne({ username: req.body.username });
      if (!userDB) {
        return next("User not found");
      }
      if (bcrypt.compareSync(req.body.password, userDB.password)) {
        const token = generateSign(userDB._id, userDB.username);
        return res.status(200).json({ userDB, token });
      }
    } catch (error) {
      error.message = "Login error";
    }
  };
  
  const logoutUser = (req, res, next) => {
    try {
      const token = null;
      return res.status(200).json(token);
    } catch (error) {
      return next(error);
    }
  };