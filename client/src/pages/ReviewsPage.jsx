import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBadge from '../components/StatusBadge';
import { apiRequest } from '../api';

const reviewStatuses = ['All', 'Draft', 'Submitted', 'Under Review', 'Rework Requested', 'Approved', 'Completed'];

function FilterIcon() {
  return (
    <svg className="filter-control__icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 5h18l-7 8v5l-4 2v-7L3 5Z" />
    </svg>
  );
}

function ReviewsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    apiRequest('/reviews')
      .then((result) => setReviews(result.data))
      .catch((requestError) => setError(requestError.message))
      .finally(() => setIsLoading(false));
  }, []);

  const filteredReviews = useMemo(() => {
    return reviews.filter((review) => {
      const matchesTab = activeTab === 'All' || review.status === activeTab;
      const matchesSearch =
        search === '' ||
        [review.employee?.name, review.employee?.manager?.name, review.department?.name, review.cycle, review.reviewId]
          .join(' ')
          .toLowerCase()
          .includes(search.toLowerCase());
      const matchesDepartment = departmentFilter === '' || review.department?.name === departmentFilter;
      const matchesStatus = statusFilter === '' || review.status === statusFilter;
      return matchesTab && matchesSearch && matchesDepartment && matchesStatus;
    });
  }, [reviews, activeTab, search, departmentFilter, statusFilter]);

  const handleTabChange = (status) => {
    setActiveTab(status);
    setStatusFilter(status === 'All' ? '' : status);
  };

  const handleStatusFilterChange = (event) => {
    const status = event.target.value;
    setStatusFilter(status);
    setActiveTab(status || 'All');
  };

  return (
    <section className="page">
      <div className="page__header">
        <div>
          <h1>Reviews</h1>
          <p>Manage appraisal cycles and track review progress across the organization.</p>
        </div>
        <button className="button button--primary" type="button" onClick={() => navigate('/reviews/new')}>
          + New Review
        </button>
      </div>

      <div className="tabs">
        {reviewStatuses.map((status) => (
          <button
            key={status}
            className={`tab${activeTab === status ? ' tab--active' : ''}`}
            onClick={() => handleTabChange(status)}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="toolbar-row">
        <input
          className="input input--search"
          type="text"
          placeholder="Search reviews..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="filter-control">
          <FilterIcon />
          <select value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value)}>
            <option value="">Departments</option>
            {[...new Set(reviews.map((review) => review.department?.name).filter(Boolean))].map((department) => (
              <option key={department} value={department}>{department}</option>
            ))}
          </select>
        </div>
        <div className="filter-control">
          <FilterIcon />
          <select value={statusFilter} onChange={handleStatusFilterChange}>
            <option value="">Statuses</option>
            {reviewStatuses.filter((status) => status !== 'All').map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="table-wrapper">
        {error && <div className="empty-state">{error}</div>}
        {isLoading ? (
          <div className="loading-state">Loading reviews...</div>
        ) : filteredReviews.length === 0 ? (
          <div className="empty-state">No reviews match the selected filters.</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Review ID</th>
                <th>Employee</th>
                <th>Department</th>
                <th>Cycle</th>
                <th>Status</th>
                <th>Progress</th>
                <th>Due Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredReviews.map((review) => (
                <tr key={review._id}>
                  <td>{review.reviewId}</td>
                  <td>{review.employee?.name || '-'}</td>
                  <td>{review.department?.name || '-'}</td>
                  <td>{review.cycle}</td>
                  <td><StatusBadge status={review.status} /></td>
                  <td>
                    <div className="progress-bar">
                      <div className="progress-bar__fill" style={{ width: `${review.progress}%` }} />
                      <span>{review.progress}%</span>
                    </div>
                  </td>
                  <td>{review.dueDate ? new Date(review.dueDate).toLocaleDateString('en-CA') : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}

export default ReviewsPage;
