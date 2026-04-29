const express = require('express');
const router = express.Router();
const collectionController = require('../controllers/collectionController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, collectionController.getCollection);
router.post('/', authMiddleware, collectionController.addToCollection);
router.put('/:id', authMiddleware, collectionController.updateCollectionItem);
router.delete('/:id', authMiddleware, collectionController.removeFromCollection);

module.exports = router;
