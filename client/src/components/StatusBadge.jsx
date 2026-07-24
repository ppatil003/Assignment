function StatusBadge({ status }) {
  const statusClass = {
    Active: 'status-badge--green',
    Approved: 'status-badge--green',
    Completed: 'status-badge--green',
    Submitted: 'status-badge--orange',
    'Under Review': 'status-badge--orange',
    'On Leave': 'status-badge--orange',
    'Rework Requested': 'status-badge--red',
    Inactive: 'status-badge--red',
    Draft: 'status-badge--gray',
  }[status] || 'status-badge--gray';

  return <span className={`status-badge ${statusClass}`}>{status}</span>;
}

export default StatusBadge;
