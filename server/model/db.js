var mongoose = require('mongoose');
const DB_URL = "mongodb://127.0.0.1:27017/test";
mongoose.connect(DB_URL);
module.exports = mongoose;
