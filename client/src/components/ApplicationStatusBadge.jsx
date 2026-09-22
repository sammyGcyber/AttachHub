import React from 'react';

export default function ApplicationStatusBadge({ status }) {
  const getStatusClass = () => {
    switch (status) {
      case 'pending': return 'badge-pending';
      case 'reviewed': return 'badge-reviewed';
      case 'shortlisted': return 'badge-shortlisted';
      case 'accepted': return 'badge-accepted';
      case 'rejected': return 'badge-rejected';
      default: return 'badge-pending';
    }
  };

  return (
    <span className={`status-badge ${getStatusClass()}`}>
      <span className="status-dot"></span>
      {status ? status.toUpperCase() : 'PENDING'}
    </span>
  );
}
