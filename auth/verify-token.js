import express from 'express';
import jwt from 'jsonwebtoken';
import createError from 'http-errors';

import config from '../config';

const router = express.Router();

router.use('/*', (req, res, next) => {
  let token = req.headers['x-access-token'];

  if (!token) {
    return next(createError(401, 'User token required.'));
  }

  jwt.verify(token, config.secret, (err) => {
    if (err) {
      return next(err);
    }

    next();
  });
});


export default router;
