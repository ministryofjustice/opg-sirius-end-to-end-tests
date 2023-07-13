require("./client-commands");
require("./commands");
require("./deputy-commands");
require("./document-commands");
require("./forms");
require("./navigation-commands");
require("./letter-commands")
require("./lpa-commands");
require("./order-commands");
require("./visit-commands");

require("cypress-failed-log");
require("cy-verify-downloads").addCustomCommand();

const registerCypressGrep = require('@cypress/grep')
registerCypressGrep()
