import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/user';

import config from '../config';
import DefaultErrors from '../lib/default-errors';

const router = express.Router();
const { incompleDataError, resourceNotFoundError } = DefaultErrors;


router.post('/register', (req, res, next) => {
  if (!req.body.name || !req.body.email || !req.body.password) {
    return next(incompleDataError());
  }

  let hashedPassword = bcrypt.hashSync(req.body.password, 8);

  User.create(
    {
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    },
    (err, user) => {
      if (err) {
        return next(err);
      }

      let token = jwt.sign(
        { id: user._id },
        config.secret,
        { expiresIn: config.tokenExpiration }
      );

      res.json({ auth: true, token: token });
    }
  );
});

router.post('/login', (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    return next(incompleDataError());
  }

  User.findOne({ email: req.body.email }, (err, user) => {
    if (err || !user) {
      return next(err ? err : resourceNotFoundError('User'));
    }

    let passwordIsvalid = bcrypt.compareSync(req.body.password, user.password);

    if (!passwordIsvalid) {
      return res.status(401).json({
        auth: false,
        token: null,
        message: 'Invalid password provided.'
      });
    }

    let token = jwt.sign({ id: user._id }, config.secret, {
      expiresIn: config.tokenExpiration
    });

    res.json({ auth: true, token: token });
  });
});

export default router;
