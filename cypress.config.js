const { defineConfig } = require("cypress");
const { verifyDownloadTasks } = require("cy-verify-downloads");
const fs = require("fs");

module.exports = defineConfig({
  defaultCommandTimeout: 60000,
  reporter: "cypress-multi-reporters",
  chromeWebSecurity: false,
  modifyObstructiveCode: false,
  viewportHeight: 1080,
  viewportWidth: 1920,
  reporterOptions: {
    configFile: "reporter-config.json"
  },
  scrollBehavior: 'center',
  e2e: {
    setupNodeEvents(on, config) {
      require('@cypress/grep/src/plugin')(config);

      on("task", {
        failed: require("cypress-failed-log/src/failed")(),
      });

      on("task", verifyDownloadTasks);

      on("task", {
        listContentsOfDownloadsFolder: (downloadsPath) => {
          return fs.readdirSync(downloadsPath);
        }
      });

      return config;
    },
    baseUrl: "http://frontend-proxy",
  },
});
