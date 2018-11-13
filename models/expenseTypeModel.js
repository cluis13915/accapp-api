import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const expenseTypeModel = new Schema({
  code: { type: String },
  title: { type: String }
});

export default mongoose.model('expenseTypes', expenseTypeModel);
