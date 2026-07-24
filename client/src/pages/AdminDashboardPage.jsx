import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const summaryCards = [
  { label: 'Total Employees', value: 187 },
  { label: 'Active Reviews', value: 58 },
  { label: 'Pending Approvals', value: 14 },
  { label: 'Completed Reviews', value: 129 },
];

const reviewActivity = [
  { department: 'HR', reviews: 18 },
  { department: 'Marketing', reviews: 14 },
  { department: 'Engineering', reviews: 21 },
  { department: 'Finance', reviews: 10 },
  { department: 'Sales', reviews: 13 },
];

const ratingDistribution = [
  { name: 'Excellent', value: 36 },
  { name: 'Good', value: 25 },
  { name: 'Average', value: 20 },
  { name: 'Below Avg', value: 12 },
  { name: 'Poor', value: 7 },
];

const performanceTrend = [
  { month: 'Jan', score: 72 },
  { month: 'Feb', score: 76 },
  { month: 'Mar', score: 79 },
  { month: 'Apr', score: 81 },
  { month: 'May', score: 85 },
  { month: 'Jun', score: 87 },
];

const pendingApprovals = [
  { id: 'REV107', employee: 'Mira Jain', department: 'Finance', reviewer: 'Priya Mehta', dueDate: '2026-06-10' },
  { id: 'REV114', employee: 'Kabir Singh', department: 'Engineering', reviewer: 'Anil Kapoor', dueDate: '2026-06-15' },
  { id: 'REV120', employee: 'Simran Kaur', department: 'HR', reviewer: 'Rohit Sharma', dueDate: '2026-06-18' },
];

const recentActivity = [
  { time: '2m ago', activity: 'Review submitted for Ananya Patel' },
  { time: '15m ago', activity: 'Department KPI scored for Marketing' },
  { time: '1h ago', activity: 'Pending approval created for REV114' },
  { time: '3h ago', activity: 'Employee profile updated: Siddharth Rao' },
];

const departmentOverview = [
  { label: 'Departments', value: 12 },
  { label: 'Average Rating', value: '4.3' },
  { label: 'Budget Utilized', value: '77%' },
  { label: 'Open Roles', value: 32 },
];

const headcountCtc = [
  { department: 'HR', headcount: 24, avgCtc: 12 },
  { department: 'Marketing', headcount: 18, avgCtc: 14 },
  { department: 'Engineering', headcount: 45, avgCtc: 19 },
  { department: 'Finance', headcount: 16, avgCtc: 11 },
];

const salaryDistribution = [
  { name: '≤ 10L', value: 34 },
  { name: '10-15L', value: 28 },
  { name: '15-20L', value: 22 },
  { name: '> 20L', value: 16 },
];

const packageBand = [
  { band: '≤10L', count: 34 },
  { band: '10-15L', count: 28 },
  { band: '15-20L', count: 22 },
  { band: '>20L', count: 16 },
];

const topDepartments = [
  { department: 'Engineering', cost: 8.4 },
  { department: 'Marketing', cost: 5.7 },
  { department: 'HR', cost: 4.2 },
  { department: 'Finance', cost: 3.8 },
  { department: 'Sales', cost: 3.3 },
];

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ec4899', '#c2410c'];

function AdminDashboardPage() {
  return (
    <section className="page">
      <div className="page__header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Monitor review health, department performance, and pending approvals.</p>
        </div>
      </div>

      <div className="summary-grid">
        {summaryCards.map((card) => (
          <div key={card.label} className="summary-card">
            <span>{card.label}</span>
            <strong>{card.value}</strong>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h2>Department Review Activity</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={reviewActivity} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="department" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="reviews" fill="#2563eb" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="dashboard-card">
          <h2>Rating Distribution</h2>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={ratingDistribution} dataKey="value" nameKey="name" innerRadius={70} outerRadius={100} paddingAngle={4}>
                {ratingDistribution.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="dashboard-card">
          <h2>Performance Trend</h2>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={performanceTrend} margin={{ top: 10, right: 15, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="score" stroke="#10b981" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="dashboard-card dashboard-card--feed">
          <h2>Recent Activity</h2>
          <div className="activity-feed">
            {recentActivity.map((item) => (
              <div key={item.time} className="feed-item">
                <span>{item.time}</span>
                <p>{item.activity}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="dashboard-grid dashboard-grid--two">
        <div className="dashboard-card dashboard-card--table">
          <h2>Pending Approvals</h2>
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Review ID</th>
                  <th>Employee</th>
                  <th>Department</th>
                  <th>Reviewer</th>
                  <th>Due Date</th>
                </tr>
              </thead>
              <tbody>
                {pendingApprovals.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.employee}</td>
                    <td>{item.department}</td>
                    <td>{item.reviewer}</td>
                    <td>{item.dueDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="dashboard-card overview-card">
          <h2>Department Overview</h2>
          <div className="overview-row">
            {departmentOverview.map((item) => (
              <div key={item.label} className="overview-stat">
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card dashboard-card--wide">
          <h2>Headcount & Avg CTC</h2>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={headcountCtc} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="department" />
              <YAxis yAxisId="left" orientation="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="headcount" fill="#2563eb" radius={[6, 6, 0, 0]} name="Headcount" />
              <Line yAxisId="right" type="monotone" dataKey="avgCtc" stroke="#10b981" strokeWidth={3} dot={false} name="Avg CTC (LPA)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="dashboard-card">
          <h2>Salary Distribution</h2>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie data={salaryDistribution} dataKey="value" nameKey="name" innerRadius={65} outerRadius={100} paddingAngle={4}>
                {salaryDistribution.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h2>Package Band Distribution</h2>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={packageBand} margin={{ top: 10, right: 20, left: 0, bottom: 0 }} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="band" />
              <Tooltip />
              <Bar dataKey="count" fill="#f59e0b" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="dashboard-card">
          <h2>Top 5 Departments by Salary Cost</h2>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={topDepartments} margin={{ top: 10, right: 20, left: 0, bottom: 0 }} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="department" />
              <Tooltip />
              <Bar dataKey="cost" fill="#ec4899" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}

export default AdminDashboardPage;
