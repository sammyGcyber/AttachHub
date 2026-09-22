const applicationModel = require('../models/applicationModel');
const studentModel = require('../models/studentModel');
const listingModel = require('../models/listingModel');

const applyToListing = async (req, res, next) => {
  try {
    const { listingId, coverNote } = req.body;
    const student = await studentModel.findByUserId(req.user.userId);
    if (!student) {
      return res.status(400).json({ message: 'Student profile required to apply.' });
    }

    const listing = await listingModel.findById(listingId);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found.' });
    }

    // Basic match score calculation
    let matchScore = 50;
    if (student.skills && listing.requirements) {
      const skills = student.skills.toLowerCase().split(',').map(s => s.trim());
      const reqs = listing.requirements.toLowerCase().split(',').map(r => r.trim());
      const matches = reqs.filter(r => skills.some(s => s.includes(r) || r.includes(s))).length;
      matchScore = Math.round((matches / reqs.length) * 100);
    }

    const application = await applicationModel.create({
      studentId: student.student_id,
      listingId,
      coverNote,
      matchScore,
    });

    res.status(201).json({ message: 'Application submitted successfully.', application });
  } catch (error) {
    if (error.code === '23505') { // Unique constraint violation in Postgres
      return res.status(400).json({ message: 'You have already applied for this listing.' });
    }
    next(error);
  }
};

const getStudentApplications = async (req, res, next) => {
  try {
    const student = await studentModel.findByUserId(req.user.userId);
    if (!student) {
      return res.status(404).json({ message: 'Student profile not found.' });
    }
    const applications = await applicationModel.findByStudentId(student.student_id);
    res.json(applications);
  } catch (error) {
    next(error);
  }
};

const getListingApplicants = async (req, res, next) => {
  try {
    const { listingId } = req.params;
    const applicants = await applicationModel.findByListingId(listingId);
    res.json(applicants);
  } catch (error) {
    next(error);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;
    const updated = await applicationModel.updateStatus(applicationId, status);
    res.json({ message: 'Application status updated successfully.', application: updated });
  } catch (error) {
    next(error);
  }
};

module.exports = { applyToListing, getStudentApplications, getListingApplicants, updateStatus };
