const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

router.post('/', bookController.createBook);
router.get('/', bookController.getAllBooks);
router.get('/search/title', bookController.searchByTitle);
router.get('/search/author', bookController.searchByAuthor);
router.get('/search/isbn', bookController.searchByISBN);

module.exports = router;