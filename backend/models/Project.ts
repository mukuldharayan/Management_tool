import mongoose, { Schema } from 'mongoose';

const projectSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ['active', 'completed'], default: 'active' },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export default mongoose.model('Project', projectSchema);
