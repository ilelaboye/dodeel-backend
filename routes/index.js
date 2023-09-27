const express = require('express');
const app = express.Router();

require('./endpoints/User')(app);
require('./endpoints/Product')(app);

module.exports = app;