import mongoose from 'mongoose';

const EmployeeSchema = new mongoose.Schema(
  {
    employeeId: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    designation: { type: String, required: true, trim: true },
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
    manager: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
    status: {
      type: String,
      enum: ['Active', 'On Leave', 'Inactive'],
      default: 'Active',
    },
    joiningDate: { type: Date },
    contactNumber: { type: String },
    dob: { type: Date },
    rating: { type: Number, min: 0, max: 5 },
  },
  {
    timestamps: true,
  }
);

const Employee = mongoose.model('Employee', EmployeeSchema);
export default Employee;
