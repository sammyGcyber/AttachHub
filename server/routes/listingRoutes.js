const express = require('express');
const router = express.Router();
const listingController = require('../controllers/listingController');
const { verifyToken } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.get('/', listingController.getListings);
router.get('/:id', listingController.getListingById);

router.post('/', verifyToken, authorizeRoles('company'), listingController.createListing);
router.put('/:id', verifyToken, authorizeRoles('company'), listingController.updateListing);

module.exports = router;
