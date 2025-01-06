const express = require('express');
const router = express.Router();
const queueService = require('../services/queue.service');

/**
 * POST /tasks
 * Body:
 * {
 *   "type": "string",
 *   "payload": { ... },
 *   "visibility_time": "string" // ISO 8601 format (optional)
 * }
 */
router.post('/', (req, res) => {
  try {
    const { type, payload, visibility_time } = req.body;

    // Convert visibility_time to a Unix timestamp (ms)
    let visibilityTime = Date.now();
    if (visibility_time) {
      const ms = new Date(visibility_time).getTime();
      if (isNaN(ms)) {
        return res.status(400).json({
          error: 'Invalid visibility_time format',
        });
      }
      visibilityTime = ms;
    }

    const task = queueService.addTask(type, payload, visibilityTime);

    return res.status(201).json({
      id: task.id,
      status: 'Task added to queue',
    });
  } catch (error) {
    console.error('Error adding task:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
