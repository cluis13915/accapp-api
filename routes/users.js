import express from 'express';
import createError from 'http-errors';
import User from '../models/user';

const router = express.Router();

const incompleDataError = () => createError(400, 'Incomplete data provided.');

const resourceNotFoundError = (resourceName = null) => createError(
  404,
  `${resourceName || 'Resource'} not found.`
);

const successResponse = (res, message = null) => res.status(200).json({
  message: message || 'OK'
});


router.post('/', (req, res, next) => {
  if (!req.body.name || !req.body.email || !req.body.password) {
    return next(incompleDataError());
  }

  User.create(
    {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    },
    (err, user) => {
      if (err) {
        return next(err);
      }

      res.json(user);
    }
  );
});

router.get('/', (req, res, next) => {
  User.find({}, (err, users) => {
    if (err) {
      return next(err);
    }

    res.json(users);
  });
});

router.get('/:id', (req, res, next) => {
  User.findById(req.params.id, (err, user) => {
    if (err || !user) {
      return next(err ? err : resourceNotFoundError());
    }

    res.json(user);
  });
});

router.delete('/:id', (req, res, next) => {
  User.findByIdAndRemove(req.params.id, (err, user) => {
    if (err) {
      return next(err);
    }

    return successResponse(res, `User ${user.name} was deleted.`);
  });
});

export default router;
