import api from './api';

export const submitApplication = async (data) => {
  const response = await api.post('/applications', data);
  return response.data;
};

export const fetchStudentApplications = async () => {
  const response = await api.get('/applications/student');
  return response.data;
};

export const fetchListingApplicants = async (listingId) => {
  const response = await api.get(`/applications/listing/${listingId}`);
  return response.data;
};

export const updateApplicationStatus = async (applicationId, status) => {
  const response = await api.patch(`/applications/${applicationId}/status`, { status });
  return response.data;
};
