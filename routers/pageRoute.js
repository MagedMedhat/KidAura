const express = require('express');
const pageController = require('../controllers/pageController');

const router = express.Router();

router.get('/', pageController.getAuthPage);
router.get('/library', pageController.getLibraryPage);
router.get('/reader/:storyId', pageController.getReaderPage);
router.get('/add-story',pageController.getAddStory);
router.post('/add-story',pageController.postAddStory);

module.exports = router;