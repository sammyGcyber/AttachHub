import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [pendingAccounts, setPendingAccounts] = useState([]);

  useEffect(() => {
    api.get('/admin/stats').then(res => setStats(res.data)).catch(console.error);
    api.get('/admin/pending-verifications').then(res => setPendingAccounts(res.data)).catch(console.error);
  }, []);

  const handleVerify = async (userId, isVerified) => {
    try {
      await api.patch(`/admin/verify/${userId}`, { isVerified });
      setPendingAccounts(pendingAccounts.filter(acc => acc.user_id !== userId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="dashboard-page">
      <h1>Administrator Control Panel</h1>

      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <h3>{stats.students}</h3>
            <p>Students</p>
          </div>
          <div className="stat-card">
            <h3>{stats.companies}</h3>
            <p>Companies</p>
          </div>
          <div className="stat-card">
            <h3>{stats.listings}</h3>
            <p>Listings</p>
          </div>
          <div className="stat-card">
            <h3>{stats.applications}</h3>
            <p>Applications</p>
          </div>
        </div>
      )}

      <h2>Pending Verification Requests ({pendingAccounts.length})</h2>
      {pendingAccounts.length === 0 ? (
        <p>No unverified accounts requiring approval.</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Entity / Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {pendingAccounts.map((acc) => (
              <tr key={acc.user_id}>
                <td>{acc.entity_name || 'N/A'}</td>
                <td>{acc.email}</td>
                <td>{acc.role.toUpperCase()}</td>
                <td>
                  <button onClick={() => handleVerify(acc.user_id, true)} className="btn-approve">Approve</button>
                  <button onClick={() => handleVerify(acc.user_id, false)} className="btn-reject">Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
