import express from 'express';
import User from '../models/user';
import DefaultErrors from '../lib/default-errors';
import SuccessReponse from '../lib/success-responses';

const router = express.Router();
const { incompleDataError, resourceNotFoundError } = DefaultErrors;
const { successRes } = SuccessReponse;


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
    if (err || !user) {
      return next(err ? err : resourceNotFoundError());
    }

    return successRes(res, `User ${user.name} was deleted.`);
  });
});

router.put('/:id', (req, res, next) => {
  User.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, user) => {
    if (err || !user) {
      return next(err ? err : resourceNotFoundError());
    }

    res.json(user);
  });
});

export default router;
