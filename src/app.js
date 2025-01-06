const express = require('express');
const bodyParser = require('body-parser');

// Import route modules
const tasksRoutes = require('./routes/tasks.routes');
const dlqRoutes = require('./routes/dlq.routes');

const app = express();

// Middleware
app.use(bodyParser.json());

// Mount routes
app.use('/tasks', tasksRoutes);
app.use('/dlq', dlqRoutes);

module.exports = app;