import { Schema, model, Types } from 'mongoose';

// Define the Reaction schema
const reactionSchema = new Schema(
  {
    reactionId: { type: Schema.Types.ObjectId, default: () => new Types.ObjectId() }, // Unique ID for each reaction
    reactionBody: { type: String, required: true, maxlength: 280 },
    username: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  {
    toJSON: { virtuals: true, getters: true },
    id: false, // Avoid returning the _id field
  }
);

// Create and export the Reaction model
const Reaction = model('Reaction', reactionSchema);

export { Reaction, reactionSchema };
