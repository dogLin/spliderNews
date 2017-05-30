var mongoose = require('mongoose');
const DB_URL = "mongodb://splider:Splider389187576@127.0.0.1:27017/spliderNews";
mongoose.connect(DB_URL);
module.exports = mongoose;
