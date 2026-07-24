import mongoose from 'mongoose';
import dns from 'node:dns';
import config from './config.js';
import { Employee, Department, Review, DailyWork } from './models/index.js';

if (config.dnsServers.length > 0) {
  dns.setServers(config.dnsServers);
}

const departmentsData = [
  { name: 'Human Resources', budget: 5200000, description: 'Talent acquisition and employee success.' },
  { name: 'Marketing', budget: 4200000, description: 'Brand, demand generation and campaigns.' },
  { name: 'Engineering', budget: 8200000, description: 'Product development and platform operations.' },
  { name: 'Finance', budget: 6100000, description: 'Financial planning, reporting, and controls.' },
  { name: 'Sales', budget: 7400000, description: 'Revenue growth and strategic customer relationships.' },
  { name: 'Operations', budget: 5000000, description: 'Efficient business processes and service delivery.' },
  { name: 'Product', budget: 6800000, description: 'Product strategy, discovery, and roadmap execution.' },
  { name: 'Customer Success', budget: 4600000, description: 'Customer onboarding, adoption, and retention.' },
];

const employeesData = [
  { employeeId: 'EMP001', name: 'Ananya Patel', designation: 'HR Business Partner', status: 'Active', joiningDate: '2022-02-14', contactNumber: '+91 98765 43210', dob: '1994-08-22', rating: 4.2 },
  { employeeId: 'EMP002', name: 'Siddharth Rao', designation: 'Marketing Lead', status: 'On Leave', joiningDate: '2021-06-10', contactNumber: '+91 91234 56789', dob: '1990-11-03', rating: 4.0 },
  { employeeId: 'EMP003', name: 'Mira Jain', designation: 'Finance Analyst', status: 'Active', joiningDate: '2023-01-20', contactNumber: '+91 99887 77665', dob: '1993-05-14', rating: 4.1 },
  { employeeId: 'EMP004', name: 'Kabir Singh', designation: 'Software Engineer', status: 'Active', joiningDate: '2022-09-01', contactNumber: '+91 97654 32109', dob: '1995-12-07', rating: 4.4 },
  { employeeId: 'EMP005', name: 'Ishita Kapoor', designation: 'Sales Manager', status: 'Active', joiningDate: '2021-11-12', contactNumber: '+91 98989 11022', dob: '1991-04-16', rating: 4.3 },
  { employeeId: 'EMP006', name: 'Arjun Mehta', designation: 'Operations Lead', status: 'Active', joiningDate: '2020-07-08', contactNumber: '+91 98111 22334', dob: '1989-09-28', rating: 4.0 },
  { employeeId: 'EMP007', name: 'Neha Gupta', designation: 'Product Manager', status: 'Active', joiningDate: '2022-05-19', contactNumber: '+91 99001 44556', dob: '1992-12-11', rating: 4.5 },
  { employeeId: 'EMP008', name: 'Vikram Das', designation: 'Customer Success Manager', status: 'On Leave', joiningDate: '2021-03-25', contactNumber: '+91 98770 66778', dob: '1990-06-04', rating: 4.2 },
];

const reviewsData = [
  { reviewId: 'REV001', cycle: 'Q1 2026', status: 'Submitted', dueDate: '2026-04-15', progress: 80, goals: [{ name: 'Improve retention', weight: 30, self: 4, manager: 4 }], competencies: [{ name: 'Leadership', self: 4, manager: 4 }], selfComments: 'Working on team engagement.', managerFeedback: 'Good progress.', overallRating: 4.1 },
  { reviewId: 'REV002', cycle: 'Q1 2026', status: 'Draft', dueDate: '2026-04-18', progress: 40, goals: [{ name: 'Launch campaign', weight: 40, self: 3.5, manager: 4 }], competencies: [{ name: 'Communication', self: 4, manager: 3.5 }], selfComments: '', managerFeedback: '', overallRating: 3.8 },
  { reviewId: 'REV003', cycle: 'Q1 2026', status: 'Under Review', dueDate: '2026-04-20', progress: 65, goals: [{ name: 'Reduce close time', weight: 35, self: 4, manager: 4 }], competencies: [{ name: 'Analysis', self: 4, manager: 4 }], selfComments: 'Improved reporting accuracy.', managerFeedback: 'Strong results.', overallRating: 4.1 },
  { reviewId: 'REV004', cycle: 'Q1 2026', status: 'Approved', dueDate: '2026-04-22', progress: 100, goals: [{ name: 'Release platform update', weight: 50, self: 4.5, manager: 4.5 }], competencies: [{ name: 'Execution', self: 4.5, manager: 4.5 }], selfComments: 'Delivered ahead of schedule.', managerFeedback: 'Excellent ownership.', overallRating: 4.5 },
  { reviewId: 'REV005', cycle: 'Q1 2026', status: 'Submitted', dueDate: '2026-04-25', progress: 75, goals: [{ name: 'Increase pipeline', weight: 45, self: 4, manager: 4 }], competencies: [{ name: 'Negotiation', self: 4, manager: 4 }], selfComments: 'Built key accounts.', managerFeedback: 'Consistent performance.', overallRating: 4.2 },
  { reviewId: 'REV006', cycle: 'Q1 2026', status: 'Rework Requested', dueDate: '2026-04-27', progress: 55, goals: [{ name: 'Improve delivery SLA', weight: 40, self: 3.5, manager: 3.5 }], competencies: [{ name: 'Planning', self: 3.5, manager: 3.5 }], selfComments: 'Working on handoffs.', managerFeedback: 'Please add more detail.', overallRating: 3.5 },
  { reviewId: 'REV007', cycle: 'Q1 2026', status: 'Completed', dueDate: '2026-04-30', progress: 100, goals: [{ name: 'Define roadmap', weight: 50, self: 4.5, manager: 4.5 }], competencies: [{ name: 'Strategy', self: 4.5, manager: 4.5 }], selfComments: 'Roadmap adopted.', managerFeedback: 'Great customer focus.', overallRating: 4.5 },
  { reviewId: 'REV008', cycle: 'Q1 2026', status: 'Draft', dueDate: '2026-05-02', progress: 30, goals: [{ name: 'Improve adoption', weight: 35, self: 3.5, manager: 3 }], competencies: [{ name: 'Collaboration', self: 4, manager: 3.5 }], selfComments: 'Collecting feedback.', managerFeedback: '', overallRating: 3.7 },
];

const dailyWorkData = [
  { mailChecked: true, customerVisit: true, complaintVerified: false, remarks: 'Visited the client site and reviewed tickets.' },
  { mailChecked: true, customerVisit: false, complaintVerified: true, remarks: 'Verified customer complaint and escalated.' },
  { mailChecked: true, customerVisit: false, complaintVerified: false, remarks: 'Reviewed monthly reports and action items.' },
  { mailChecked: true, customerVisit: true, complaintVerified: true, remarks: 'Completed release validation and customer follow-up.' },
  { mailChecked: false, customerVisit: true, complaintVerified: false, remarks: 'Met a strategic prospect and documented next steps.' },
  { mailChecked: true, customerVisit: false, complaintVerified: true, remarks: 'Resolved service escalation with the delivery team.' },
  { mailChecked: true, customerVisit: true, complaintVerified: false, remarks: 'Validated product feedback in a customer workshop.' },
  { mailChecked: false, customerVisit: false, complaintVerified: true, remarks: 'Reviewed onboarding health and closed support issues.' },
];

async function seed() {
  await mongoose.connect(config.mongodbUri);
  console.log('Connected to MongoDB');

  const departments = await Promise.all(
    departmentsData.map((department) =>
      Department.findOneAndUpdate(
        { name: department.name },
        { $set: department },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      )
    )
  );

  const employeeDocs = await Promise.all(
    employeesData.map(async (employee, index) => {
      const department = departments[index % departments.length];
      return Employee.findOneAndUpdate(
        { employeeId: employee.employeeId },
        { $set: { ...employee, department: department._id } },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );
    })
  );

  const hodUpdatePromises = departments.map((department, index) => {
    const hod = employeeDocs[index];
    return Department.findByIdAndUpdate(department._id, { hod: hod._id });
  });
  await Promise.all(hodUpdatePromises);

  await Promise.all(
    reviewsData.map((review, index) => {
      const employee = employeeDocs[index];
      const department = departments[index % departments.length];
      return Review.findOneAndUpdate(
        { reviewId: review.reviewId },
        { $set: { ...review, employee: employee._id, department: department._id } },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );
    })
  );

  await Promise.all(
    dailyWorkData.map((entry, index) => {
      const employee = employeeDocs[index];
      const date = new Date();
      date.setDate(date.getDate() - index);
      return DailyWork.findOneAndUpdate(
        { employee: employee._id, date },
        { $set: { ...entry, employee: employee._id, date } },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );
    })
  );

  console.log('Seed data added successfully without deleting existing records');
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((error) => {
  console.error('Seed error:', error);
  process.exit(1);
});
