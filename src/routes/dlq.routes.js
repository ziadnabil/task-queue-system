const express = require('express');
const router = express.Router();

// Import the DLQ controller
const dlqController = require('../controllers/dlq.controller');

// GET /dlq
router.get('/', dlqController.getDLQ);

// DELETE /dlq
router.delete('/', dlqController.clearDLQ);

module.exports = router;
