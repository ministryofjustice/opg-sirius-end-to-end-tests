require("./commands");
require("./client-commands");
require("./deputy-commands");
require("./lpa-commands");
require("./visit-commands.js");
require("./document-commands");
require("./supervision-commands");

require("cypress-failed-log");
require("cy-verify-downloads").addCustomCommand();

const registerCypressGrep = require('@cypress/grep')
registerCypressGrep()
