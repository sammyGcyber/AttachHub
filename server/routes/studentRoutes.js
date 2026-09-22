const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { verifyToken } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.get('/profile', verifyToken, authorizeRoles('student'), studentController.getProfile);
router.put('/profile', verifyToken, authorizeRoles('student'), studentController.updateProfile);

module.exports = router;
