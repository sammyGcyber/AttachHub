const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');
const { verifyToken } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.get('/profile', verifyToken, authorizeRoles('company'), companyController.getProfile);
router.put('/profile', verifyToken, authorizeRoles('company'), companyController.updateProfile);

module.exports = router;
