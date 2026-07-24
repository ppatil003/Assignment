import { useEffect, useMemo, useState } from 'react';
import { apiRequest } from '../api';

function DailyWorkPage() {
  const [employees, setEmployees] = useState([]);
  const [historyRows, setHistoryRows] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [checklist, setChecklist] = useState({
    mailChecked: false,
    customerVisit: false,
    complaintVerified: false,
    remarks: '',
  });

  const formattedDate = selectedDate.toLocaleDateString('en-CA');

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const history = useMemo(() => {
    return historyRows.filter((row) => row.employee?._id === selectedEmployee);
  }, [historyRows, selectedEmployee]);

  useEffect(() => {
    Promise.all([apiRequest('/employees'), apiRequest('/dailywork')])
      .then(([employeeResult, dailyWorkResult]) => {
        setEmployees(employeeResult.data);
        setHistoryRows(dailyWorkResult.data);
        setSelectedEmployee((current) => current || employeeResult.data[0]?._id || '');
      })
      .catch((requestError) => setError(requestError.message))
      .finally(() => setIsLoading(false));
  }, []);

  const updateChecklist = (field, value) => {
    setChecklist((prev) => ({ ...prev, [field]: value }));
  };

  const moveDate = (direction) => {
    setSelectedDate((prev) => {
      const next = new Date(prev);
      next.setDate(prev.getDate() + direction);
      return next;
    });
  };

  const handleSave = async () => {
    if (!selectedEmployee) return setError('Create an employee before saving daily work.');
    try {
      const saved = await apiRequest('/dailywork', {
        method: 'POST',
        body: JSON.stringify({ ...checklist, employee: selectedEmployee, date: formattedDate }),
      });
      setHistoryRows((current) => [
        { ...saved, employee: employees.find((employee) => employee._id === selectedEmployee) },
        ...current,
      ]);
      setError('');
      alert('Checklist saved to MongoDB.');
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  return (
    <section className="page">
      <div className="page__header">
        <div>
          <h1>Daily Work</h1>
          <p>Manage daily checklist completion and review the last 30 days of activity.</p>
        </div>
      </div>

      <div className="dailywork-panel">
        <div className="dailywork-controls">
          <label>
            Employee
            <select value={selectedEmployee} onChange={(e) => setSelectedEmployee(e.target.value)}>
              {employees.map((employee) => (
                <option key={employee._id} value={employee._id}>
                  {employee.name}
                </option>
              ))}
            </select>
          </label>

          <div className="date-navigator">
            <button className="button button--secondary" onClick={() => moveDate(-1)} type="button">
              ◀
            </button>
            <div className="date-display">{formattedDate}</div>
            <button className="button button--secondary" onClick={() => moveDate(1)} type="button">
              ▶
            </button>
          </div>
        </div>

        <div className="checklist-card">
          <h2>Checklist</h2>
          <div className="checklist-grid">
            <div className="checklist-item">
              <span>Mail Checked</span>
              <div className="toggle-group">
                <button
                  type="button"
                  className={`button ${checklist.mailChecked ? 'button--primary' : 'button--secondary'}`}
                  onClick={() => updateChecklist('mailChecked', true)}
                >
                  Yes
                </button>
                <button
                  type="button"
                  className={`button ${!checklist.mailChecked ? 'button--primary' : 'button--secondary'}`}
                  onClick={() => updateChecklist('mailChecked', false)}
                >
                  No
                </button>
              </div>
            </div>
            <div className="checklist-item">
              <span>Customer Visit</span>
              <div className="toggle-group">
                <button
                  type="button"
                  className={`button ${checklist.customerVisit ? 'button--primary' : 'button--secondary'}`}
                  onClick={() => updateChecklist('customerVisit', true)}
                >
                  Yes
                </button>
                <button
                  type="button"
                  className={`button ${!checklist.customerVisit ? 'button--primary' : 'button--secondary'}`}
                  onClick={() => updateChecklist('customerVisit', false)}
                >
                  No
                </button>
              </div>
            </div>
            <div className="checklist-item">
              <span>Complaint Verified</span>
              <div className="toggle-group">
                <button
                  type="button"
                  className={`button ${checklist.complaintVerified ? 'button--primary' : 'button--secondary'}`}
                  onClick={() => updateChecklist('complaintVerified', true)}
                >
                  Yes
                </button>
                <button
                  type="button"
                  className={`button ${!checklist.complaintVerified ? 'button--primary' : 'button--secondary'}`}
                  onClick={() => updateChecklist('complaintVerified', false)}
                >
                  No
                </button>
              </div>
            </div>
            <label className="form-grid-full">
              Remarks
              <textarea
                rows="4"
                value={checklist.remarks}
                onChange={(e) => updateChecklist('remarks', e.target.value)}
              />
            </label>
          </div>
          <button className="button button--primary" onClick={handleSave} type="button">
            Save Checklist
          </button>
        </div>
      </div>

      <div className="section-header">
        <h2>Checklist History</h2>
        <p>Last 30 days of checklist submissions for the selected employee.</p>
      </div>
      {error && <div className="empty-state">{error}</div>}
      <div className="table-wrapper">
        {isLoading ? (
          <div className="loading-state">Loading history...</div>
        ) : history.length === 0 ? (
          <div className="empty-state">No history found for the chosen employee.</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Mail Checked</th>
                <th>Customer Visit</th>
                <th>Complaint Verified</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {history.map((row) => (
                <tr key={row._id}>
                  <td>{new Date(row.date).toLocaleDateString('en-CA')}</td>
                  <td>{row.mailChecked ? 'Yes' : 'No'}</td>
                  <td>{row.customerVisit ? 'Yes' : 'No'}</td>
                  <td>{row.complaintVerified ? 'Yes' : 'No'}</td>
                  <td>{row.remarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}

export default DailyWorkPage;
