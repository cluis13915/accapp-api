import mongoose from 'mongoose';

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || '27017';
const DB_NAME = process.env.DB_NAME || 'accapp';
const DB_USER = process.env.DB_USER || 'admin';
const DB_PASSWORD = process.env.DB_PASSWORD || 'admin';

mongoose.connect(
  `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`,
  {
    useNewUrlParser: true
  }
);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Unable to connect to db:'));
db.once('open', function() {
  console.log('Successfully connected to db.');
});
