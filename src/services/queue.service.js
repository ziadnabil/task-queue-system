const { v4: uuidv4 } = require('uuid');

/**
 * In-memory queue and DLQ
 */
let taskQueue = [];
let deadLetterQueue = [];

/**
 * Configuration
 */
const MAX_RETRY_ATTEMPTS = 3;
const BASE_DELAY_MS = 1000; // For exponential backoff

/**
 * Adds a new task to the queue
 * @param {string} type - Task type
 * @param {object} payload - Arbitrary task data
 * @param {number} visibilityTime - Timestamp (ms) when task becomes visible
 * @returns {object} The created task
 */
function addTask(type, payload, visibilityTime) {
  const task = {
    id: uuidv4(),
    type,
    payload,
    createdAt: Date.now(),
    visibilityTime: visibilityTime || Date.now(),
    retryCount: 0,
  };

  taskQueue.push(task);
  return task;
}

/**
 * Retrieves the next visible task in FIFO order
 * @returns {object|null} The next visible task or null if none
 */
function getNextVisibleTask() {
  const now = Date.now();

  for (let i = 0; i < taskQueue.length; i++) {
    if (taskQueue[i].visibilityTime <= now) {
      // If it's visible, remove it from queue and return
      const [task] = taskQueue.splice(i, 1);
      return task;
    }
  }

  return null;
}

/**
 * Handles a failed task. Retries or moves it to DLQ if max attempts are reached.
 * @param {object} task
 * @param {string} errorMessage
 */
function handleFailedTask(task, errorMessage) {
  task.retryCount += 1;

  if (task.retryCount >= MAX_RETRY_ATTEMPTS) {
    // move to DLQ
    deadLetterQueue.push({
      ...task,
      error: errorMessage || 'Unknown error',
    });
    return;
  }

  // Exponential backoff
  const delay = BASE_DELAY_MS * Math.pow(2, task.retryCount - 1);
  task.visibilityTime = Date.now() + delay;

  // Push it back into the queue
  taskQueue.push(task);
}

/**
 * Handles a successful task (no-op in this in-memory approach)
 */
function handleSuccessfulTask(task) {
  // In a persistent system, we would mark the task as done or remove from queue.
  // With in-memory + immediate removal in getNextVisibleTask(), there's nothing to do here.
}

/**
 * Returns all tasks in the Dead Letter Queue
 */
function getDLQ() {
  return deadLetterQueue;
}

/**
 * Clears the Dead Letter Queue
 */
function clearDLQ() {
  deadLetterQueue = [];
}

module.exports = {
  addTask,
  getNextVisibleTask,
  handleFailedTask,
  handleSuccessfulTask,
  getDLQ,
  clearDLQ,
};
