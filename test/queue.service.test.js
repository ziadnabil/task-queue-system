const { expect } = require('chai');
const queueService = require('../src/services/queue.service');

describe('Queue Service', () => {
  afterEach(() => {
    queueService.clearDLQ();
  });

  it('should add a task to the queue', () => {
    const now = Date.now();
    const task = queueService.addTask('test-type', { foo: 'bar' }, now);
    expect(task).to.have.property('id');
    expect(task.type).to.equal('test-type');
    expect(task.payload).to.deep.equal({ foo: 'bar' });
  });

  it('should handle failed tasks and move them to DLQ after max retries', () => {
    const task = queueService.addTask('test-type', {});
    for (let i = 0; i < 3; i++) {
      queueService.handleFailedTask(task, 'Test failure');
    }
    // After 3 attempts, it should be in the DLQ
    const dlq = queueService.getDLQ();
    expect(dlq).to.have.lengthOf(1);
    expect(dlq[0].error).to.equal('Test failure');
  });
});
