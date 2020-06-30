import express from 'express';
import User from '../models/user';
import DefaultErrors from '../lib/default-errors';
import createError from 'http-errors';
import SuccessReponse from '../lib/success-responses';

const router = express.Router();
const { resourceNotFoundError } = DefaultErrors;
const { successRes } = SuccessReponse;


// To create user, the register endpoint must be used.

// Get list of users.
router.get('/', (req, res, next) => {
  User.find({}, (err, users) => {
    if (err) {
      return next(err);
    }

    res.json(users.map(u => u.asResponse()));
  });
});


// Get user by ID.
router.get('/:id', (req, res, next) => {
  User.findById(req.params.id, (err, user) => {
    if (err || !user) {
      return next(err ? err : resourceNotFoundError());
    }

    res.json(user.asResponse());
  });
});


// Delete user by ID.
router.delete('/:id', (req, res, next) => {
  User.findByIdAndRemove(req.params.id, (err, user) => {
    if (err || !user) {
      return next(err ? err : resourceNotFoundError());
    }

    return successRes(res, `User ${user.name} was deleted.`);
  });
});


// Update user by ID.
router.patch('/:id', (req, res, next) => {
  User.findById(req.params.id, (err, user) => {
    if (err || !user) {
      return next(err ? err : resourceNotFoundError());
    }

    const data = req.body;

    if (data.password) {
      return next(createError(400, 'Password cannot be set.'));
    } else if (data.username && (data.username !== user.username)) {
      return next(createError(400, 'Username cannot be changed.'));
    } else if (data.email && (data.email !== user.email)) {
      return next(createError(400, 'Email cannot be changed.'));
    }

    Object.assign(user, data);

    user.save(function(err, userUpdated) {
      if (err) {
        return next(err);
      }

      res.json(userUpdated.asResponse());
    });
  });
});


export default router;
