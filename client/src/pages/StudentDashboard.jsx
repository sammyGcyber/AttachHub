import React, { useEffect, useState } from 'react';
import { fetchStudentApplications } from '../services/applicationService';
import ApplicationStatusBadge from '../components/ApplicationStatusBadge';

export default function StudentDashboard() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudentApplications()
      .then(setApplications)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const shortlistedCount = applications.filter(a => a.status === 'shortlisted' || a.status === 'accepted').length;
  const avgMatch = applications.length > 0 
    ? Math.round(applications.reduce((acc, curr) => acc + (curr.match_score || 0), 0) / applications.length)
    : 0;

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Student Dashboard</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Track your submitted industrial attachment & internship applications in real-time.</p>
      </div>

      <div className="stats-banner">
        <div className="stat-box">
          <div className="stat-number">{applications.length}</div>
          <div className="stat-label">Applications Submitted</div>
        </div>
        <div className="stat-box">
          <div className="stat-number">{shortlistedCount}</div>
          <div className="stat-label">Shortlisted / Accepted</div>
        </div>
        <div className="stat-box">
          <div className="stat-number">{avgMatch}%</div>
          <div className="stat-label">Average Match Score</div>
        </div>
      </div>

      {loading ? (
        <p>Loading your placement applications...</p>
      ) : applications.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '12px' }}>
          <h3>No applications submitted yet</h3>
          <p style={{ color: 'var(--text-muted)' }}>Explore openings on the home page and apply with 1 click!</p>
        </div>
      ) : (
        <div className="table-card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Listing Position</th>
                <th>Company</th>
                <th>Department</th>
                <th>Match Score</th>
                <th>Applied Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.application_id}>
                  <td><strong>{app.title}</strong></td>
                  <td>{app.company_name}</td>
                  <td>{app.department}</td>
                  <td>
                    <span className="match-score-badge">
                      ⚡ {app.match_score}%
                    </span>
                  </td>
                  <td>{new Date(app.applied_at).toLocaleDateString()}</td>
                  <td><ApplicationStatusBadge status={app.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
