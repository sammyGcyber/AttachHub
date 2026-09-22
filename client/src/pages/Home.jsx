import React, { useState, useEffect } from 'react';
import { fetchListings } from '../services/listingService';
import ListingCard from '../components/ListingCard';

export default function Home() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [industry, setIndustry] = useState('');
  const [location, setLocation] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Full-Stack', 'Cybersecurity', 'Fintech', 'Cloud & DevOps', 'Networking'];

  const loadListings = async (selectedIndustry = industry) => {
    setLoading(true);
    try {
      const data = await fetchListings({ 
        industry: selectedIndustry === 'All' ? '' : selectedIndustry, 
        location 
      });
      setListings(data);
    } catch (error) {
      console.error('Failed to load listings', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadListings();
  }, []);

  const handleCategoryClick = (cat) => {
    setActiveCategory(cat);
    const filterTerm = cat === 'All' ? '' : cat;
    setIndustry(filterTerm);
    loadListings(filterTerm);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadListings();
  };

  return (
    <div className="home-page">
      {/* Hero Header */}
      <header className="hero-section">
        <div className="hero-badge">✨ Official Attachment & Internship Gateway</div>
        <h1>
          Secure Your Ideal <span>Industrial Placement</span> Digitally
        </h1>
        <p>
          Connect directly with verified organizations, get instant profile-to-job compatibility scoring, and track applications live.
        </p>

        <form onSubmit={handleSearch} className="search-container">
          <div className="search-input-group">
            🔍
            <input
              type="text"
              placeholder="Search roles or skills (e.g. React, Cyber, Python)..."
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
            />
          </div>
          <div className="search-input-group">
            📍
            <input
              type="text"
              placeholder="Location (e.g. Nairobi, Westlands)..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-search">Search Openings</button>
        </form>

        <div className="category-chips">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`chip ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => handleCategoryClick(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      {/* Platform Key Stats */}
      <section className="stats-banner">
        <div className="stat-box">
          <div className="stat-number">100%</div>
          <div className="stat-label">Verified Listings</div>
        </div>
        <div className="stat-box">
          <div className="stat-number">Real-Time</div>
          <div className="stat-label">Application Status Tracking</div>
        </div>
        <div className="stat-box">
          <div className="stat-number">Automated</div>
          <div className="stat-label">Match Score Calculation</div>
        </div>
        <div className="stat-box">
          <div className="stat-number">0 Paperwork</div>
          <div className="stat-label">Walk-in Free Digital Process</div>
        </div>
      </section>

      {/* Openings Grid */}
      <section className="listings-section">
        <div className="listings-header">
          <h2>Featured Placements</h2>
          <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Showing {listings.length} Openings</span>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <p>Loading curated attachment opportunities...</p>
          </div>
        ) : listings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '12px' }}>
            <h3>No placement listings found</h3>
            <p style={{ color: 'var(--text-muted)' }}>Try resetting your filter or search terms.</p>
          </div>
        ) : (
          <div className="listings-grid">
            {listings.map((listing) => (
              <ListingCard key={listing.listing_id} listing={listing} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
