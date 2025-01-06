const express = require('express');
const router = express.Router();
const queueService = require('../services/queue.service');

/**
 * GET /dlq
 * Returns the dead-letter queue contents
 */
router.get('/', (req, res) => {
  const dlq = queueService.getDLQ();
  return res.status(200).json(dlq);
});

/**
 * DELETE /dlq
 * Clears the dead-letter queue
 */
router.delete('/', (req, res) => {
  queueService.clearDLQ();
  return res.status(200).json({ status: 'DLQ cleared' });
});

module.exports = router;
