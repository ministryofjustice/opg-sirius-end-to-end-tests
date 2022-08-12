const { defineConfig } = require("cypress");

module.exports = defineConfig({
  defaultCommandTimeout: 60000,
  reporter: "junit",
  chromeWebSecurity: false,
  modifyObstructiveCode: false,
  viewportHeight: 1080,
  viewportWidth: 1920,
  reporterOptions: {
    mochaFile: "/test-results/junit-[hash].xml",
  },
  e2e: {
    setupNodeEvents(on, config) {
      require("cypress-grep/src/plugin")(config);

      on("task", {
        failed: require("cypress-failed-log/src/failed")(),
      });
    },
    baseUrl: "http://frontend-proxy",
  },
});
