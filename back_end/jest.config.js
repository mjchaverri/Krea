/** @type {import('jest').Config} */
const config = {
  // Automatically clear mock calls, instances, contexts and results before every test
  clearMocks: true,

  // The test environment that will be used for testing
  testEnvironment: "node",

  // Indicates whether each individual test should be reported during the run
  verbose: true,
};

module.exports = config;
