const queueService = require('./queue.service');

/**
 * Example task processor function
 * Replace with real logic to handle different task types/payloads
 */
async function processTask(task) {
  // Simulate random success/failure (about 30% chance to fail)
  if (Math.random() > 0.7) {
    throw new Error(`Failed to process task ${task.id}`);
  }

  // Simulate an asynchronous operation
  await new Promise((resolve) => setTimeout(resolve, 500));
  console.log(`Successfully processed task ${task.id} (type: ${task.type})`);
}

/**
 * The worker loop: continuously fetch and process tasks
 */
async function workerLoop() {
  while (true) {
    // Get the next visible task
    const task = queueService.getNextVisibleTask();

    if (!task) {
      // No tasks are visible, wait a bit
      await new Promise((resolve) => setTimeout(resolve, 1000));
      continue;
    }

    try {
      await processTask(task);
      queueService.handleSuccessfulTask(task);
    } catch (error) {
      console.error(error.message);
      queueService.handleFailedTask(task, error.message);
    }
  }
}

/**
 * Start the worker
 */
function startWorker() {
  workerLoop().catch((err) => {
    console.error('Worker encountered an error:', err);
  });
}

module.exports = {
  startWorker,
};
