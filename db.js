import mongoose from 'mongoose';

mongoose.connect(
  'mongodb://admin:admin@localhost:27017/accapp',
  {
    useNewUrlParser: true
  }
);
