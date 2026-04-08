const express = require('express');
const router = express.Router();
const listingController = require('../controllers/listingController');

router.post('/', listingController.createListing);
router.get('/', listingController.getAllListings);
router.get('/:id', listingController.getListingById);
router.put('/:id', listingController.updateListing);
router.delete('/:id', listingController.deleteListing);

module.exports = router;