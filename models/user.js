import mongoose from 'mongoose';
import { validateEmail } from './validators/email';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 256,
  },
  last_name: {
    type: String,
    maxlength: 256,
  },
  username: {
    type: String,
    unique: true,
    required: true,
    minlength: 3,
    maxlength: 256,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: validateEmail,
      message: props => `${props.value} is not a valid email`
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 7,
    maxlength: 256,
  }
}, {
  timestamps: true
});

UserSchema.methods.asResponse = function() {
  let obj = this.toObject();

  delete obj.password;

  return obj;
};

mongoose.model('User', UserSchema);

export default mongoose.model('User');
