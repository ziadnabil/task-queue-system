const app = require('./app');
const workerService = require('./services/worker.service');

const PORT = process.env.PORT || 3000;

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

  // Start the worker in the same process
  workerService.startWorker();
});
