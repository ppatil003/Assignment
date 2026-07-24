import { useMemo, useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

const departments = [
  { id: 'DEP001', name: 'Human Resources' },
  { id: 'DEP002', name: 'Marketing' },
  { id: 'DEP003', name: 'Engineering' },
];

const kpiData = {
  'Human Resources': {
    totalEmployees: 24,
    totalSalaryCost: 12400000,
    budgetUtilized: 68,
    openPositions: 4,
  },
  Marketing: {
    totalEmployees: 18,
    totalSalaryCost: 9800000,
    budgetUtilized: 74,
    openPositions: 3,
  },
  Engineering: {
    totalEmployees: 45,
    totalSalaryCost: 26200000,
    budgetUtilized: 82,
    openPositions: 6,
  },
};

const finances = [
  { name: 'Jan', salary: 120, sales: 160, budget: 190 },
  { name: 'Feb', salary: 130, sales: 175, budget: 200 },
  { name: 'Mar', salary: 140, sales: 190, budget: 210 },
  { name: 'Apr', salary: 130, sales: 185, budget: 205 },
  { name: 'May', salary: 145, sales: 200, budget: 220 },
];

const avgCtc = [
  { name: 'Manager', amount: 22 },
  { name: 'Senior', amount: 18 },
  { name: 'Mid', amount: 12 },
  { name: 'Junior', amount: 7 },
];

const headcountDonut = [
  { name: 'Manager', value: 6 },
  { name: 'Senior', value: 12 },
  { name: 'Mid', value: 18 },
  { name: 'Junior', value: 9 },
];

const unitDistribution = [
  { name: 'Recruitment', value: 25 },
  { name: 'Employee Relations', value: 15 },
  { name: 'L&D', value: 20 },
  { name: 'Payroll', value: 10 },
  { name: 'Compliance', value: 30 },
];

const departmentKpis = [
  { name: 'Employee Retention', target: 95, actual: 89, unit: '%', achievement: 94, weight: 20 },
  { name: 'Time to Hire', target: 30, actual: 35, unit: 'days', achievement: 85, weight: 15 },
  { name: 'Training Completion', target: 100, actual: 92, unit: '%', achievement: 92, weight: 18 },
];

const hodRatingCriteria = [
  { criteria: 'Leadership', rating: 4.5 },
  { criteria: 'Decision Making', rating: 4.2 },
  { criteria: 'Communication', rating: 4.6 },
];

const COLORS = ['#2563eb', '#f59e0b', '#10b981', '#ef4444'];

function DepartmentsDashboardPage() {
  const [selectedDepartment, setSelectedDepartment] = useState(departments[0].name);
  const [kpis, setKpis] = useState(departmentKpis);
  const [ratings, setRatings] = useState(hodRatingCriteria);

  const currentKpi = kpiData[selectedDepartment];

  const handleKpiChange = (index, field, value) => {
    setKpis((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleRatingChange = (index, value) => {
    setRatings((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], rating: value };
      return next;
    });
  };

  const chartTitle = `KPI overview for ${selectedDepartment}`;

  return (
    <section className="page">
      <div className="page__header">
        <div>
          <h1>Department Dashboard</h1>
          <p>View department-level KPIs, charts, and editable performance tables.</p>
        </div>
        <select value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)}>
          {departments.map((department) => (
            <option key={department.id} value={department.name}>
              {department.name}
            </option>
          ))}
        </select>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card">
          <span>Total Employees</span>
          <strong>{currentKpi.totalEmployees}</strong>
        </div>
        <div className="kpi-card">
          <span>Total Salary Cost</span>
          <strong>₹{currentKpi.totalSalaryCost.toLocaleString()}</strong>
        </div>
        <div className="kpi-card">
          <span>Budget Utilized</span>
          <strong>{currentKpi.budgetUtilized}%</strong>
        </div>
        <div className="kpi-card">
          <span>Open Positions</span>
          <strong>{currentKpi.openPositions}</strong>
        </div>
      </div>

      <section className="chart-area">
        <div className="chart-card">
          <h2>Salary vs Sales vs Budget</h2>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={finances} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="salary" stroke="#2563eb" strokeWidth={3} dot={false} />
              <Line type="monotone" dataKey="sales" stroke="#10b981" strokeWidth={3} dot={false} />
              <Line type="monotone" dataKey="budget" stroke="#f59e0b" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h2>Designation-wise Avg CTC</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={avgCtc} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#2563eb" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="chart-area chart-area--grid">
        <div className="chart-card chart-card--small">
          <h2>Designation Headcount</h2>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={headcountDonut}
                dataKey="value"
                nameKey="name"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
              >
                {headcountDonut.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card chart-card--small">
          <h2>Unit-wise Distribution</h2>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={unitDistribution}
                dataKey="value"
                nameKey="name"
                outerRadius={95}
                label
              >
                {unitDistribution.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="editable-section">
        <div className="section-header">
          <h2>Department KPIs</h2>
          <p>Edit KPI targets and achievements directly.</p>
        </div>
        <div className="table-wrapper">
          <table className="table table--compact">
            <thead>
              <tr>
                <th>KPI</th>
                <th>Target</th>
                <th>Actual</th>
                <th>Unit</th>
                <th>Achievement %</th>
                <th>Weight %</th>
              </tr>
            </thead>
            <tbody>
              {kpis.map((kpi, index) => (
                <tr key={kpi.name}>
                  <td>{kpi.name}</td>
                  <td>
                    <input
                      type="number"
                      value={kpi.target}
                      onChange={(e) => handleKpiChange(index, 'target', Number(e.target.value))}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={kpi.actual}
                      onChange={(e) => handleKpiChange(index, 'actual', Number(e.target.value))}
                    />
                  </td>
                  <td>{kpi.unit}</td>
                  <td>
                    <input
                      type="number"
                      value={kpi.achievement}
                      onChange={(e) => handleKpiChange(index, 'achievement', Number(e.target.value))}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={kpi.weight}
                      onChange={(e) => handleKpiChange(index, 'weight', Number(e.target.value))}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="editable-section">
        <div className="section-header">
          <h2>HOD Rating Criteria</h2>
          <p>Rate HOD performance on core criteria.</p>
        </div>
        <div className="table-wrapper">
          <table className="table table--compact">
            <thead>
              <tr>
                <th>Criteria</th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
              {ratings.map((row, index) => (
                <tr key={row.criteria}>
                  <td>{row.criteria}</td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      value={row.rating}
                      onChange={(e) => handleRatingChange(index, Number(e.target.value))}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}

export default DepartmentsDashboardPage;
