import api from './api';

export const fetchListings = async (params = {}) => {
  const response = await api.get('/listings', { params });
  return response.data;
};

export const fetchListingById = async (id) => {
  const response = await api.get(`/listings/${id}`);
  return response.data;
};

export const createListing = async (listingData) => {
  const response = await api.post('/listings', listingData);
  return response.data;
};

export const updateListing = async (id, listingData) => {
  const response = await api.put(`/listings/${id}`, listingData);
  return response.data;
};
