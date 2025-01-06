const express = require('express');
const router = express.Router();

// Import the Tasks controller
const tasksController = require('../controllers/tasks.controller');

// POST /tasks
router.post('/', tasksController.addTask);

module.exports = router;
