import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import logger from 'morgan';

import db from './db';

import verifyToken from './auth/verify-token';
import authRouter from './auth/AuthController';
import usersRouter from './routes/users';
import expenseTypesRouter from './routes/expenseTypes';

const app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

const corsOptions = {
  origin: 'http://localhost:3001',
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/auth', authRouter);
app.use(verifyToken);
app.use('/users', usersRouter);
app.use('/expenseTypes', expenseTypesRouter);


// Catch 404 and forward to error handler
app.use((req, res, next) => next(createError(404)));

// Catch model validation errors to send a 400 to the user.
app.use((err, req, res, next) => {
  console.log('ERROR 1: Validation error...');
  console.log(err);
  const { name, message } = err;

  if (name === 'ValidationError') {
    const err_res = Object.values(err.errors)
      .map(({ name, path, message, value }) => ({ name, path, message, value }));

    return res.status(400).json({ name, message, errors: err_res });
  }

  next(err, req, res);
});

// Catch unique validation errors to send a 400 to the user.
app.use((err, req, res, next) => {
  console.log('ERROR 2: Unique validation error...');
  console.log(err);
  if (err.message.indexOf('duplicate key error') !== -1) {
    return res.status(400).json({ message: err.message });
  }

  next(err, req, res);
});

// WARNING: Main error handler. Defining 4 arguments is required by Express, so
// ignore linter warnings. Check http://expressjs.com/en/guide/error-handling.html
app.use((err, req, res, next) => {
  console.log('ERROR 3: Uncatched error...');
  console.log(err);
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // return error in json format
  res.status(err.status || 500).json({ message: err.message });
});

module.exports = app;
