require("./client-commands");
require("./commands");
require("./deputy-commands");
require("./document-commands");
require("./forms");
require("./letter-commands")
require("./lpa-commands");
require("./order-commands");
require("./visit-commands.js");

require("cypress-failed-log");
require("cy-verify-downloads").addCustomCommand();

const registerCypressGrep = require('@cypress/grep')
registerCypressGrep()
