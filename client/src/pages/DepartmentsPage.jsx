import { useEffect, useMemo, useState } from 'react';
import Modal from '../components/Modal';
import { apiRequest } from '../api';

function DepartmentsPage() {
  const [search, setSearch] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([apiRequest('/departments'), apiRequest('/employees')])
      .then(([departmentData, employeeData]) => {
        setDepartments(departmentData);
        setEmployees(employeeData.data);
      })
      .catch((requestError) => setError(requestError.message));
  }, []);

  const filteredDepartments = useMemo(() => {
    return departments.filter((department) => {
      const searchMatch =
        search === '' ||
        [department.name, department.hod?.name, department.description]
          .join(' ')
          .toLowerCase()
          .includes(search.toLowerCase());
      const departmentMatch = selectedDepartment === '' || department.name === selectedDepartment;
      return searchMatch && departmentMatch;
    });
  }, [departments, search, selectedDepartment]);

  const openNewModal = () => {
    setEditingDepartment(null);
    setIsModalOpen(true);
  };

  const openEditModal = (department) => {
    setEditingDepartment(department);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingDepartment(null);
  };

  const handleSave = async (event) => {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget));
    const payload = {
      name: values.name,
      hod: values.hod || undefined,
      budget: Number(values.budget),
      description: values.description || undefined,
    };
    try {
      const saved = await apiRequest(editingDepartment ? `/departments/${editingDepartment._id}` : '/departments', {
        method: editingDepartment ? 'PUT' : 'POST',
        body: JSON.stringify(payload),
      });
      setDepartments((current) => editingDepartment
        ? current.map((department) => (department._id === saved._id ? saved : department))
        : [...current, saved]);
      closeModal();
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const handleDelete = async (department) => {
    if (!window.confirm(`Delete ${department.name}?`)) return;
    try {
      await apiRequest(`/departments/${department._id}`, { method: 'DELETE' });
      setDepartments((current) => current.filter((item) => item._id !== department._id));
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  return (
    <section className="page">
      <div className="page__header">
        <div>
          <h1>Departments</h1>
          <p>Track department budgets, HOD assignments, headcount, and performance metrics.</p>
        </div>
        <button className="button button--primary" onClick={openNewModal}>
          + Add Department
        </button>
      </div>

      <div className="toolbar-row">
        <input
          className="input input--search"
          type="text"
          placeholder="Search departments..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)}>
          <option value="">All Departments</option>
          {departments.map((department) => (
            <option key={department._id} value={department.name}>
              {department.name}
            </option>
          ))}
        </select>
      </div>

      {error && <div className="empty-state">{error}</div>}
      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>HOD</th>
              <th>Employees</th>
              <th>Budget</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDepartments.map((department) => {
              const departmentEmployees = employees.filter((employee) => employee.department?._id === department._id);
              return <tr key={department._id}>
                <td>{department._id.slice(-6)}</td>
                <td>{department.name}</td>
                <td>{department.hod?.name || '-'}</td>
                <td>{departmentEmployees.length ? departmentEmployees.map((employee) => employee.name).join(', ') : '-'}</td>
                <td>₹{department.budget.toLocaleString()}</td>
                <td>
                  <button
                    className="icon-button"
                    onClick={() => openEditModal(department)}
                    aria-label="Edit department"
                  >
                    ✏️
                  </button>
                  <button className="icon-button icon-button--danger" onClick={() => handleDelete(department)} aria-label="Delete department">
                    🗑️
                  </button>
                </td>
              </tr>;
            })}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <Modal
          title={editingDepartment ? 'Edit Department' : 'Add Department'}
          onClose={closeModal}
        >
          <form className="form-grid" onSubmit={handleSave}>
            <label>
              Department Name
              <input name="name" type="text" defaultValue={editingDepartment?.name || ''} required />
            </label>
            <label>
              HOD
              <select name="hod" defaultValue={editingDepartment?.hod?._id || editingDepartment?.hod || ''}>
                <option value="">Select HOD</option>
                {employees.map((employee) => (
                  <option key={employee._id} value={employee._id}>
                    {employee.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Budget
              <input
                name="budget"
                type="number"
                defaultValue={editingDepartment?.budget || ''}
                min="0"
                required
              />
            </label>
            <label className="form-grid-full">
              Description
              <textarea name="description" defaultValue={editingDepartment?.description || ''} rows="4" />
            </label>
            <div className="form-actions">
              <button className="button button--secondary" type="button" onClick={closeModal}>
                Cancel
              </button>
              <button className="button button--primary" type="submit">
                Save
              </button>
            </div>
          </form>
        </Modal>
      )}
    </section>
  );
}

export default DepartmentsPage;
