const express = require('express');
const app = express.Router();

require('./endpoints/User')(app);
require('./endpoints/Adtendance')(app);
require('./endpoints/user_report')(app);

module.exports = app;