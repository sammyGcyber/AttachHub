import React from 'react';
import { Link } from 'react-router-dom';

export default function ListingCard({ listing }) {
  const getCompanyInitial = (name) => (name ? name.charAt(0).toUpperCase() : 'A');

  const tags = listing.requirements
    ? listing.requirements.split(',').map((t) => t.trim()).slice(0, 3)
    : [listing.industry || 'ICT'];

  return (
    <div className="listing-card">
      <div>
        <div className="card-top">
          <div className="company-avatar">
            {getCompanyInitial(listing.company_name)}
          </div>
          {listing.matchScore !== undefined && (
            <span className="match-score-badge">
              ⚡ {listing.matchScore}% Match
            </span>
          )}
        </div>

        <h3 className="listing-title">{listing.title}</h3>
        <p className="company-name">
          {listing.company_name} <span className="verified-icon">✓</span>
        </p>

        <p className="listing-desc">{listing.description}</p>

        <div className="tag-list">
          <span className="tag-item">{listing.industry || 'Technology'}</span>
          <span className="tag-item">📍 {listing.location || 'Nairobi'}</span>
          {tags.map((tag, idx) => (
            <span key={idx} className="tag-item">{tag}</span>
          ))}
        </div>
      </div>

      <div className="card-footer">
        <span className="slots-count">👥 {listing.slots_available || 1} Open Slots</span>
        <Link to={`/listings/${listing.listing_id}`} className="btn-details">
          Apply Now →
        </Link>
      </div>
    </div>
  );
}
