const queueService = require('../services/queue.service');

/**
 * GET /dlq
 * Returns the content of the Dead Letter Queue
 */
exports.getDLQ = (req, res) => {
  try {
    const dlq = queueService.getDLQ();
    return res.status(200).json(dlq);
  } catch (error) {
    console.error('Error fetching DLQ:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * DELETE /dlq
 * Clears the Dead Letter Queue
 */
exports.clearDLQ = (req, res) => {
  try {
    queueService.clearDLQ();
    return res.status(200).json({ status: 'DLQ cleared' });
  } catch (error) {
    console.error('Error clearing DLQ:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
