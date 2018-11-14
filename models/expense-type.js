import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ExpenseTypeSchema = new Schema({
  code: { type: String },
  title: { type: String }
});

mongoose.model('ExpenseType', ExpenseTypeSchema);

export default mongoose.model('ExpenseType');
