//src/models/User.ts
// Import the schema
import { Schema, model, Document } from 'mongoose';

interface IUser extends Document {
  username: string;
  email: string;
  thoughts: Schema.Types.ObjectId[]; // References to Thought objects
  friends: Schema.Types.ObjectId[]; // References to Thought objects
  friendCount?: number; // Virtual property doesn't need to be stored in DB
}

const userSchema = new Schema<IUser>(
  { 
    username: {type: String,  required: true, unique: true, trim: true},  // Username field (unique and required)
    email: {type: String, required: true,  unique: true, match: [/^([\w-]+(\.[\w-]+)*@\w+(\.\w+)+)$/, 'Please fill a valid email address']},// Email field (unique and required)
    thoughts: [{type: Schema.Types.ObjectId, ref: 'Thought',},], // Array of references to Thought objects
    friends: [{type: Schema.Types.ObjectId, ref: 'User',},], // Array of references to User objects
  }, {
    toJSON: {virtuals: true,}, // Ensures virtuals are included in JSON output
  });

// Virtual property for calculating the number of friends
userSchema.virtual('friendCount').get(function (this: IUser) {
     return this.friends.length; // Calculates the number of friends based on the friends array
  })

// Creates the User model based on the schema
const User = model('User', userSchema);

export default User;  // Exports the User model