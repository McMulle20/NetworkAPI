import { Schema, model, Document } from 'mongoose';
import { IReaction } from './Reaction';

interface IThought extends Document {
  thoughtText: string;
  createdAt: Date;
  username: string;
  reactions: IReaction[];
}

const thoughtSchema = new Schema<IThought>({
  thoughtText: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 280
  },
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
  username: {
    type: String,
    required: true
  },
  reactions: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Reaction'
    }
  ]
});

// Virtual for reaction count
thoughtSchema.virtual('reactionCount').get(function () {
  return this.reactions.length;
});

const Thought = model<IThought>('Thought', thoughtSchema);

export default Thought;
