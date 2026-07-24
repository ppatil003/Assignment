import { useEffect, useMemo, useRef, useState } from 'react';
import Modal from '../components/Modal';
import StatusBadge from '../components/StatusBadge';
import { apiRequest } from '../api';

const statuses = ['Active', 'On Leave', 'Inactive'];

function EmployeesPage() {
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [designationFilter, setDesignationFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState('');
  const formRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [employeeResult, departmentResult] = await Promise.all([
          apiRequest('/employees'),
          apiRequest('/departments'),
        ]);
        setEmployees(employeeResult.data);
        setDepartments(departmentResult);
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const searchMatch =
        search === '' ||
        [employee.name, employee.employeeId, employee.designation, employee.department?.name, employee.manager?.name]
          .join(' ')
          .toLowerCase()
          .includes(search.toLowerCase());
      const departmentMatch = departmentFilter === '' || employee.department?._id === departmentFilter;
      const designationMatch = designationFilter === '' || employee.designation === designationFilter;
      const statusMatch = statusFilter === '' || employee.status === statusFilter;
      return searchMatch && departmentMatch && designationMatch && statusMatch;
    });
  }, [employees, search, departmentFilter, designationFilter, statusFilter]);

  const availableDepartments = useMemo(
    () => departments.filter((department) => employees.some((employee) => employee.department?._id === department._id)),
    [departments, employees]
  );
  const availableDesignations = useMemo(
    () => [...new Set(employees.map((employee) => employee.designation).filter(Boolean))].sort(),
    [employees]
  );

  const openNewModal = () => {
    setEditingEmployee(null);
    setIsModalOpen(true);
  };

  const openEditModal = (employee) => {
    setEditingEmployee(employee);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingEmployee(null);
  };

  const handleSave = async (event) => {
    event.preventDefault();
    if (!formRef.current?.checkValidity()) return formRef.current?.reportValidity();
    const values = Object.fromEntries(new FormData(formRef.current));
    const payload = {
      employeeId: values.employeeId,
      name: values.name,
      designation: values.designation,
      department: values.department,
      status: values.status,
      joiningDate: values.joiningDate || undefined,
      contactNumber: values.contactNumber || undefined,
      dob: values.dob || undefined,
      rating: values.rating ? Number(values.rating) : undefined,
    };
    try {
      const path = editingEmployee ? `/employees/${editingEmployee._id}` : '/employees';
      const method = editingEmployee ? 'PUT' : 'POST';
      const saved = await apiRequest(path, { method, body: JSON.stringify(payload) });
      setEmployees((current) => editingEmployee
        ? current.map((employee) => (employee._id === saved._id ? { ...saved, department: departments.find((d) => d._id === saved.department) || saved.department } : employee))
        : [...current, { ...saved, department: departments.find((d) => d._id === saved.department) || saved.department }]);
      closeModal();
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const noResults = !isLoading && filteredEmployees.length === 0;

  const handleExport = () => {
    const csvHeader = 'Employee ID,Full Name,Designation,Department,Manager,Status,Joining Date,Contact Number,Date of Birth,Rating\n';
    const csvData = filteredEmployees
      .map((employee) =>
        [
          employee.employeeId,
          employee.name,
          employee.designation,
          employee.department?.name || '',
          employee.manager?.name || '',
          employee.status,
          employee.joiningDate,
          employee.contactNumber,
          employee.dob,
          employee.rating,
        ].join(',')
      )
      .join('\n');
    const blob = new Blob([csvHeader + csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'employees.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="page">
      <div className="page__header">
        <div>
          <h1>Employees</h1>
          <p>Manage employee records, search, filter and export employee data.</p>
        </div>
        <button className="button button--primary" onClick={openNewModal}>
          + Add Employee
        </button>
      </div>

      <div className="toolbar-row">
        <input
          className="input input--search"
          type="text"
          placeholder="Search employees..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value)}>
          <option value="">All Departments</option>
          {availableDepartments.map((department) => (
            <option key={department._id} value={department._id}>
              {department.name}
            </option>
          ))}
        </select>
        <select value={designationFilter} onChange={(e) => setDesignationFilter(e.target.value)}>
          <option value="">All Designations</option>
          {availableDesignations.map((designation) => (
            <option key={designation} value={designation}>
              {designation}
            </option>
          ))}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Statuses</option>
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        <button className="button" onClick={handleExport}>
          Export
        </button>
      </div>

      <div className="table-wrapper">
        {error && <div className="empty-state">{error}</div>}
        {isLoading ? (
          <div className="loading-state">Loading employees...</div>
        ) : noResults ? (
          <div className="empty-state">No employees match the current filters.</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Full Name</th>
                <th>Designation</th>
                <th>Department</th>
                <th>Manager</th>
                <th>Status</th>
                <th>Joining Date</th>
                <th>Contact</th>
                <th>Rating</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((employee) => (
                <tr key={employee._id}>
                  <td>{employee.employeeId}</td>
                  <td>{employee.name}</td>
                  <td>{employee.designation}</td>
                  <td>{employee.department?.name || '-'}</td>
                  <td>{employee.manager?.name || '-'}</td>
                  <td>
                    <StatusBadge status={employee.status} />
                  </td>
                  <td>{employee.joiningDate}</td>
                  <td>{employee.contactNumber}</td>
                  <td>{employee.rating}</td>
                  <td>
                    <button className="button button--small" onClick={() => openEditModal(employee)}>
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <Modal title={editingEmployee ? 'Edit Employee' : 'Add Employee'} onClose={closeModal}>
          <form
            ref={formRef}
            className="form-grid"
            onSubmit={handleSave}
          >
            <label>
              Employee ID <span className="required-indicator">*</span>
              <input name="employeeId" type="text" defaultValue={editingEmployee?.employeeId || ''} required />
            </label>
            <label>
              Full name <span className="required-indicator">*</span>
              <input name="name" type="text" defaultValue={editingEmployee?.name || ''} required />
            </label>
            <label>
              Designation <span className="required-indicator">*</span>
              <input name="designation" type="text" defaultValue={editingEmployee?.designation || ''} required />
            </label>
            <label>
              Department <span className="required-indicator">*</span>
              <select name="department" defaultValue={editingEmployee?.department?._id || editingEmployee?.department || ''} required>
                <option value="">Select department</option>
                {departments.map((department) => (
                  <option key={department._id} value={department._id}>
                    {department.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Status
              <select name="status" defaultValue={editingEmployee?.status || 'Active'}>
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Joining Date
              <input name="joiningDate" type="date" defaultValue={editingEmployee?.joiningDate?.slice(0, 10) || ''} />
            </label>
            <label>
              Contact Number
              <input name="contactNumber" type="tel" defaultValue={editingEmployee?.contactNumber || ''} />
            </label>
            <label>
              Date of Birth
              <input name="dob" type="date" defaultValue={editingEmployee?.dob?.slice(0, 10) || ''} />
            </label>
            <label>
              Rating
              <input name="rating" type="number" min="0" max="5" step="0.1" defaultValue={editingEmployee?.rating || ''} />
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

export default EmployeesPage;
