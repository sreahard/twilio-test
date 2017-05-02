var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MessageSchema = new Schema({
  from: String,
  body: String,
  amount: Number,
  messageSid: String,
  fromCity: String,
  fromState: String,
  fromZip: Number,
  fromCountry: String,
});

module.exports = mongoose.model('Message', MessageSchema);
