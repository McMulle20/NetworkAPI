//src/models/Reaction.ts
import { Schema, Document, Types } from 'mongoose';

// Define the Reaction inferface
export interface IReaction extends Document {
  reactionId: Types.ObjectId;
  reactionBody: string;
  username: string;
  createdAt: Date;
}

// Define the Reaction schema
const reactionSchema = new Schema<IReaction>(
  { 
    reactionId: {type: Schema.Types.ObjectId, default: () => new Types.ObjectId()}, // Unique ID for each reaction
    reactionBody: {type: String, maxlength: 280},
    username: {type: String, required: true},    
    createdAt: {
        type: Date,
        default: Date.now,
        get: (timestamp: Date): any => {
            if (!timestamp) return null;
            return new Date(timestamp).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            });
        }
    },   
  },
  {
    toJSON: {
      getters: true,
    },
    _id: false, // Avoid returning the _id field
  }
);

// Create and export the Reaction model
export default reactionSchema;