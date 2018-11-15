import express from 'express';
import jwt from 'jsonwebtoken';

import config from '../config';

const router = express.Router();

router.use('/*', (req, res, next) => {
  let token = req.headers['x-access-token'];

  if (!token) {
    return res.status(401).json({ auth: false, message: 'No token provided.' });
  }

  jwt.verify(token, config.secret, (err) => {
    if (err) {
      return next(err);
    }

    next();
  });
});


export default router;
