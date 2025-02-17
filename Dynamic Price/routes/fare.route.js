const express = require('express');
const router = express.Router();
const fareController = require('../controllers/fare.controller');

router.post('/fare', fareController.getFare);

module.exports = router; 
