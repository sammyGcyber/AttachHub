import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, profile } = useAuth();

  if (!user) return <p>Please log in to view your profile.</p>;

  return (
    <div className="profile-page">
      <h1>Account Profile</h1>
      <div className="profile-card">
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role?.toUpperCase()}</p>
        <p><strong>Verification Status:</strong> {user.is_verified ? 'Verified ✅' : 'Pending Verification ⏳'}</p>

        {profile && (
          <div className="profile-details">
            <h3>Profile Information</h3>
            {user.role === 'student' ? (
              <>
                <p><strong>Name:</strong> {profile.full_name}</p>
                <p><strong>Institution:</strong> {profile.institution}</p>
                <p><strong>Course:</strong> {profile.course}</p>
                <p><strong>Skills:</strong> {profile.skills || 'Not specified'}</p>
              </>
            ) : (
              <>
                <p><strong>Company Name:</strong> {profile.company_name}</p>
                <p><strong>Industry:</strong> {profile.industry}</p>
                <p><strong>Location:</strong> {profile.location}</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
