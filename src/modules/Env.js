require("dotenv").config();
process.conf = { ...require("../../package.json"), ...require("../../config") };
global.log = require("./Logger");
