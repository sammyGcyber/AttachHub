const listingModel = require('../models/listingModel');
const companyModel = require('../models/companyModel');
const studentModel = require('../models/studentModel');

// Calculate match score between student profile and listing requirements
const calculateMatchScore = (student, listing) => {
  if (!student || !student.skills || !listing || !listing.requirements) return 0;
  const studentSkills = student.skills.toLowerCase().split(',').map(s => s.trim());
  const reqs = listing.requirements.toLowerCase().split(',').map(r => r.trim());

  let matches = 0;
  reqs.forEach(req => {
    if (studentSkills.some(skill => skill.includes(req) || req.includes(skill))) {
      matches += 1;
    }
  });

  return reqs.length > 0 ? Math.round((matches / reqs.length) * 100) : 50;
};

const getListings = async (req, res, next) => {
  try {
    const { industry, location } = req.query;
    const listings = await listingModel.findAll({ industry, location });

    if (req.user && req.user.role === 'student') {
      const student = await studentModel.findByUserId(req.user.userId);
      const enrichedListings = listings.map(l => ({
        ...l,
        matchScore: calculateMatchScore(student, l),
      }));
      return res.json(enrichedListings);
    }

    res.json(listings);
  } catch (error) {
    next(error);
  }
};

const getListingById = async (req, res, next) => {
  try {
    const listing = await listingModel.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found.' });
    }

    if (req.user && req.user.role === 'student') {
      const student = await studentModel.findByUserId(req.user.userId);
      listing.matchScore = calculateMatchScore(student, listing);
    }

    res.json(listing);
  } catch (error) {
    next(error);
  }
};

const createListing = async (req, res, next) => {
  try {
    const company = await companyModel.findByUserId(req.user.userId);
    if (!company) {
      return res.status(400).json({ message: 'Company profile required before posting listings.' });
    }

    const newListing = await listingModel.create({ companyId: company.company_id, ...req.body });
    res.status(201).json({ message: 'Listing created successfully.', listing: newListing });
  } catch (error) {
    next(error);
  }
};

const updateListing = async (req, res, next) => {
  try {
    const company = await companyModel.findByUserId(req.user.userId);
    const updated = await listingModel.update(req.params.id, company.company_id, req.body);
    if (!updated) {
      return res.status(404).json({ message: 'Listing not found or access denied.' });
    }
    res.json({ message: 'Listing updated successfully.', listing: updated });
  } catch (error) {
    next(error);
  }
};

module.exports = { getListings, getListingById, createListing, updateListing };
