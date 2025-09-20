import mongoose, { Schema } from 'mongoose';

const taskSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ['todo', 'in-progress', 'done'], default: 'todo' },
  dueDate: { type: Date },
  project: { type: Schema.Types.ObjectId, ref: 'Project', required: true }
}, { timestamps: true });

export default mongoose.model('Task', taskSchema);
