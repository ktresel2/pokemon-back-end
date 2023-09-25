const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
const auth = require("../../lib/auth");


const errors = require("../../lib/custom_errors");

// see above for explanation of "salting", 10 rounds is recommended
const bcryptSaltRounds = 10;

const BadParamsError = errors.BadParamsError;
const BadCredentialsError = errors.BadCredentialsError;

const User = require("../models/user");

// @route   POST api/users
// @desc     Register a user
// @access  Public
router.post(
  "/sign-up",
  [
    check("name", "Please include a name").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a valid password with 6 or more charcters"
    ).isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req.body.credentials);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body.credentials;

    try {
      let user = await User.findOne({ email: email });

      if (user) {
        return res.status(400).json({ msg: "User already exists" });
      }

      user = new User({
        name,
        email,
        hashedPassword: password
      });

      const salt = await bcrypt.genSalt(10);
      user.hashedPassword = await bcrypt.hash(password, salt);
      await user.save();

      const payload = {
        user: {
          id: user.id,
        },
      };
      jwt.sign(
        payload,
        process.env.jwtSecret,
        {
          expiresIn: 360000,
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;

// SIGN IN
// POST /sign-in
router.post(
  "/sign-in",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req.body.credentials);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body.credentials;
    try {
      let user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ msg: "Invalid Credentials" });
      }

      const isMatch = await bcrypt.compare(password, user.hashedPassword);

      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid Credentials" });
      }
      const payload = {
        user: {
          id: user.id,
        },
      };
      jwt.sign(
        payload,
        process.env.jwtSecret,
        {
          expiresIn: 360000,
        },
        (err, token) => {
          user.token = token
          if (err) throw err;
          user.save()
          res.json({ user });
        }
      );

    } catch (err) {
      console.error("err: ", err.message);
      res.status(500).send("Server Error");
    }
    
  }
);

// CHANGE password
// PATCH /change-password
router.patch("/change-password", auth, (req, res, next) => {
  let user;
  // `req.user` will be determined by decoding the token payload
  User.findById(req.user.id)
    // save user outside the promise chain
    .then((record) => {
      user = record;
    })
    // check that the old password is correct
    .then(() => bcrypt.compare(req.body.passwords.old, user.hashedPassword))
    // `correctPassword` will be true if hashing the old password ends up the
    // same as `user.hashedPassword`
    .then((correctPassword) => {
      // throw an error if the new password is missing, an empty string,
      // or the old password was wrong
      if (!req.body.passwords.new || !correctPassword) {
        throw new BadParamsError();
      }
    })
    // hash the new password
    .then(() => bcrypt.hash(req.body.passwords.new, bcryptSaltRounds))
    .then((hash) => {
      // set and save the new hashed password in the DB
      user.hashedPassword = hash;
      return user.save();
    })
    // respond with no content and status 200
    .then(() => res.sendStatus(204))
    // pass any errors along to the error handler
    .catch(next);
});

router.post("/sign-out", auth, (req, res, next) => {
  // create a new random token for the user, invalidating the current one
  
  // save the token and respond with 204
    res.sendStatus(204)
    .catch(next());
});

module.exports = router;
