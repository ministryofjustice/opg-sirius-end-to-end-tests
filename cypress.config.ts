import { defineConfig } from "cypress";
import { verifyDownloadTasks } from "cy-verify-downloads";
import { plugin as cypressGrepPlugin } from '@cypress/grep/plugin'
import cypress_failed_log from "cypress-failed-log/src/failed";
import * as fs from "fs";

module.exports = defineConfig({
  defaultCommandTimeout: 60000,
  requestTimeout: 60000,
  responseTimeout: 60000,
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
      cypressGrepPlugin(config);

      on("task", {
        failed: cypress_failed_log(),
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
