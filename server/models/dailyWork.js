import mongoose from 'mongoose';

const DailyWorkSchema = new mongoose.Schema(
  {
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    date: { type: Date, required: true },
    mailChecked: { type: Boolean, default: false },
    customerVisit: { type: Boolean, default: false },
    complaintVerified: { type: Boolean, default: false },
    remarks: { type: String },
  },
  {
    timestamps: true,
  }
);

DailyWorkSchema.index({ employee: 1, date: 1 }, { unique: true });

const DailyWork = mongoose.model('DailyWork', DailyWorkSchema);
export default DailyWork;
