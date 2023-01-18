require("./commands");
require("./client-commands");
require("./deputy-commands");
require("./lpa-commands");
require("cypress-failed-log");

const registerCypressGrep = require('@cypress/grep')
registerCypressGrep()