import mongoose from 'mongoose';

const KpiSchema = new mongoose.Schema({
  name: { type: String, required: true },
  target: { type: Number, required: true },
  actual: { type: Number, required: true },
  unit: { type: String, required: true },
  achievement: { type: Number, required: true },
  weight: { type: Number, required: true },
});

const DepartmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    hod: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
    budget: { type: Number, default: 0 },
    description: { type: String },
    kpis: [KpiSchema],
  },
  {
    timestamps: true,
  }
);

const Department = mongoose.model('Department', DepartmentSchema);
export default Department;
