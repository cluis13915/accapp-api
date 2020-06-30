import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/user';

import config from '../config';
import DefaultErrors from '../lib/default-errors';
import createError from 'http-errors';

const router = express.Router();
const { incompleteDataError, resourceNotFoundError } = DefaultErrors;


router.post('/register', (req, res, next) => {
  const data = req.body;

  // We need to validate the password because it is hashed befores the schema
  // validations are applied.
  if (!data.password) {
    return next(createError(400, 'No password provided'));
  }

  if (data.password.length < 7) {
    return next(createError(400, 'Password is to short'));
  }

  let hashedPassword = bcrypt.hashSync(data.password, 8);

  User.create(
    {
      name: data.name,
      last_name: data.last_name || null,
      username: data.username,
      email: data.email,
      password: hashedPassword,
    },
    (err, user) => {
      if (err) {
        return next(err);
      }

      res.json(user.asResponse());
    }
  );
});

router.post('/login', (req, res, next) => {
  const data = req.body;

  if (!data.email || !data.password) {
    return next(createError(400, 'You must provide both email and password.'));
  }

  User.findOne({ email: data.email }, (err, user) => {
    if (err || !user) {
      return next(err ? err : resourceNotFoundError('User'));
    }

    let passwordIsvalid = bcrypt.compareSync(data.password, user.password);

    if (!passwordIsvalid) {
      return next(createError(401, 'Invalid password provided.'));
    }

    let token = jwt.sign({ id: user._id }, config.secret, {
      expiresIn: config.tokenExpiration
    });

    res.json({ user: user, token: token });
  });
});

export default router;
