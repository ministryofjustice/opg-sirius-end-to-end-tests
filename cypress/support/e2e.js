require("./commands");
require("./client-commands");
require("./deputy-commands");
require("./lpa-commands");
require("./visit-commands.js");

require("cypress-failed-log");

const registerCypressGrep = require('@cypress/grep')
registerCypressGrep()