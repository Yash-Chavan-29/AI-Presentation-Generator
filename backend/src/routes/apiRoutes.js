const express = require('express');
const router = express.Router();
const generateController = require('../controllers/generateController');

// Route for presentation generation
router.post('/generate', generateController.generate);

module.exports = router;
