import mongoose from 'mongoose';

const GoalSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    weight: { type: Number, min: 0, max: 100, default: 0 },
    self: { type: Number, min: 0, max: 5 },
    manager: { type: Number, min: 0, max: 5 },
  },
  { _id: false }
);

const CompetencySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    self: { type: Number, min: 0, max: 5 },
    manager: { type: Number, min: 0, max: 5 },
  },
  { _id: false }
);

const ReviewSchema = new mongoose.Schema(
  {
    reviewId: { type: String, required: true, unique: true, trim: true },
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
    cycle: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ['Draft', 'Submitted', 'Under Review', 'Rework Requested', 'Approved', 'Completed'],
      default: 'Draft',
    },
    dueDate: { type: Date },
    progress: { type: Number, min: 0, max: 100, default: 0 },
    goals: [GoalSchema],
    competencies: [CompetencySchema],
    selfComments: { type: String },
    managerFeedback: { type: String },
    overallRating: { type: Number, min: 0, max: 5 },
  },
  {
    timestamps: true,
  }
);

const Review = mongoose.model('Review', ReviewSchema);
export default Review;
