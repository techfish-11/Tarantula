const { Crawler, Task } = require('../index');

test('should export Crawler and Task modules', () => {
  expect(Crawler).toBeDefined();
  expect(Task).toBeDefined();
});