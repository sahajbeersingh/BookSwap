const express = require('express');
const router = express.Router();
const listingController = require('../controllers/listingController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/mine', authMiddleware, listingController.getMyListings);
router.post('/', authMiddleware, listingController.createListing);
router.get('/', listingController.getAllListings);
router.get('/:id', listingController.getListingById);
router.put('/:id', listingController.updateListing);
router.delete('/:id', authMiddleware, listingController.deleteListing);

module.exports = router;
