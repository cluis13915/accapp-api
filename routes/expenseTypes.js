import express from 'express';
import createError from 'http-errors';
import ExpenseType from '../models/expense-type';

const expenseTypeRouter = express.Router();

expenseTypeRouter.route('/')
  .get((req, res) => {
    ExpenseType.find({}, (err, expenseTypes) => res.json(expenseTypes));
  })
  .post((req, res, next) => {
    if (!req.body.code || !req.body.title) {
      return next(createError(400, 'Incomplete data provided.'));
    }

    let expenseType = new ExpenseType(req.body);

    expenseType.save();

    res.status(201).send(expenseType);
  });

expenseTypeRouter.use('/:id', (req, res, next) => {
  ExpenseType.findById(req.params.id, (err, expenseType) => {
    if (err || !expenseType) {
      return next(err ? err : createError(
        404,
        `ExpenseType ${req.params.id} not found.`
      ));
    }

    req.expenseType = expenseType;

    next();
  });
});

expenseTypeRouter.route('/:id')
  .get((req, res) => res.json(req.expenseType))
  .put((req, res) => {
    req.expenseType.code = req.body.code;
    req.expenseType.title = req.body.title;

    req.expenseType.save();

    res.json(req.expenseType);
  })
  .patch((req, res) => {
    if (req.body._id) {
      delete req.body._id;
    }

    for (let b in req.body) {
      req.expenseType[b] = req.body[b];
    }

    req.expenseType.save();

    res.json(req.expenseType);
  })
  .delete((req, res) => {
    req.expenseType.remove(err => {
      if (err) {
        return res.status(500).send(err);
      }

      res.status(204).send('removed');
    });
  });

export default expenseTypeRouter;
