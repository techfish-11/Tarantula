const { Crawler, Task } = require('../index');

describe('Module Exports', () => {
  test('should export Crawler module', () => {
    expect(Crawler).toBeDefined();
  });

  test('should export Task module', () => {
    expect(Task).toBeDefined();
  });
});