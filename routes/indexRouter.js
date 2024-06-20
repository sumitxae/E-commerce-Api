const express = require('express');
const router = express.Router();
const { sessionController, homePageController } = require('../controllers/indexController');
const { isAuthenticated } = require('../middlewares/authoriser');

router.get('/', isAuthenticated, homePageController);

router.post('/user', isAuthenticated, sessionController);

module.exports = router;