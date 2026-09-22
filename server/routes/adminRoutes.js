const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.use(verifyToken, authorizeRoles('admin'));

router.get('/pending-verifications', adminController.getPendingVerifications);
router.patch('/verify/:userId', adminController.verifyUserAccount);
router.get('/stats', adminController.getPlatformStats);

module.exports = router;
