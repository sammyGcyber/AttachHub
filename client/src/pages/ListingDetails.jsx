import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchListingById } from '../services/listingService';
import { submitApplication } from '../services/applicationService';
import { useAuth } from '../context/AuthContext';

export default function ListingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [listing, setListing] = useState(null);
  const [coverNote, setCoverNote] = useState('');
  const [statusMsg, setStatusMsg] = useState('');

  useEffect(() => {
    fetchListingById(id)
      .then(setListing)
      .catch(console.error);
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      await submitApplication({ listingId: listing.listing_id, coverNote });
      setStatusMsg('Application submitted successfully!');
    } catch (err) {
      setStatusMsg(err.response?.data?.message || 'Failed to submit application.');
    }
  };

  if (!listing) return <div className="loading">Loading position details...</div>;

  return (
    <div className="listing-details-page">
      <div className="details-header">
        <h1>{listing.title}</h1>
        <p className="company">{listing.company_name} — {listing.location}</p>
        {listing.matchScore !== undefined && (
          <div className="match-banner">Your Profile Compatibility Score: <strong>{listing.matchScore}%</strong></div>
        )}
      </div>

      <div className="details-content">
        <section>
          <h3>Description</h3>
          <p>{listing.description}</p>
        </section>

        <section>
          <h3>Requirements & Qualifications</h3>
          <p>{listing.requirements}</p>
        </section>

        <section>
          <h3>Department & Slots</h3>
          <p>Department: {listing.department} | Available Slots: {listing.slots_available}</p>
        </section>

        {user?.role === 'student' && (
          <form onSubmit={handleApply} className="application-form">
            <h3>Apply for this Placement</h3>
            {statusMsg && <div className="info-banner">{statusMsg}</div>}
            <div className="form-group">
              <label>Cover Note / Message to Employer</label>
              <textarea
                rows={3}
                value={coverNote}
                onChange={(e) => setCoverNote(e.target.value)}
                placeholder="Briefly state why you are interested in this attachment..."
              />
            </div>
            <button type="submit" className="btn-primary">Submit Application</button>
          </form>
        )}
      </div>
    </div>
  );
}
