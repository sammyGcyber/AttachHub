import React, { useState } from 'react';
import { createListing } from '../services/listingService';

export default function CompanyDashboard() {
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    description: '',
    requirements: '',
    slotsAvailable: 1,
  });
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createListing(formData);
      setMessage('Attachment opportunity posted successfully!');
      setFormData({ title: '', department: '', description: '', requirements: '', slotsAvailable: 1 });
    } catch (err) {
      setMessage('Failed to post listing.');
    }
  };

  return (
    <div className="dashboard-page">
      <h1>Company Dashboard</h1>
      <p>Post and manage attachment & internship openings for students.</p>

      {message && <div className="info-banner">{message}</div>}

      <div className="card-form">
        <h2>Post New Opening</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Position Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. IT Support Attaché"
            />
          </div>
          <div className="form-group">
            <label>Department</label>
            <input
              type="text"
              required
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              placeholder="e.g. ICT Services"
            />
          </div>
          <div className="form-group">
            <label>Role Description</label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Requirements / Skills Needed (comma separated)</label>
            <input
              type="text"
              required
              value={formData.requirements}
              onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
              placeholder="Networking, Linux, Troubleshooting"
            />
          </div>
          <div className="form-group">
            <label>Available Slots</label>
            <input
              type="number"
              min="1"
              value={formData.slotsAvailable}
              onChange={(e) => setFormData({ ...formData, slotsAvailable: parseInt(e.target.value, 10) })}
            />
          </div>
          <button type="submit" className="btn-primary">Post Opening</button>
        </form>
      </div>
    </div>
  );
}
