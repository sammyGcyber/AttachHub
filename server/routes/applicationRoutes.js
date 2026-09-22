const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const { verifyToken } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.post('/', verifyToken, authorizeRoles('student'), applicationController.applyToListing);
router.get('/student', verifyToken, authorizeRoles('student'), applicationController.getStudentApplications);
router.get('/listing/:listingId', verifyToken, authorizeRoles('company', 'admin'), applicationController.getListingApplicants);
router.patch('/:applicationId/status', verifyToken, authorizeRoles('company', 'admin'), applicationController.updateStatus);

module.exports = router;
