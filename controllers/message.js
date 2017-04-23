var twilio = require('twilio');
var config = require('../config');

// Create an authenticated Twilio REST API client
var client = twilio(config.accountSid, config.authToken);

// Render a form that will allow the user to send a text (or picture) message 
// to a phone number they entered.
exports.showSendMessage = function(request, response) {
    response.render('sendMessage', {
        title: 'Sending Messages with Twilio'
    });
};

// Handle a form POST to send a message to a given number
exports.sendMessage = function(request, response) {
    client.messages.create({ 
        to: cfg.myNumber, 
        from: cfg.twilioNumber, 
        body: req.body.message, 
        mediaUrl: "https://c1.staticflickr.com/3/2899/14341091933_1e92e62d12_b.jpg",  
    }, function(err, message) { 
        console.log(message.sid); 
    });
};

// Show a page displaying text/picture messages that have been sent to this
// web application, which we have stored in the database
exports.showReceiveMessage = function(request, response) {

};

// Handle a POST request from Twilio for an incoming message
exports.receiveMessageWebhook = function(request, response) {

};

// Update the configured Twilio number for this demo to send all incoming
// messages to this server.
exports.configureNumber = function(request, response) {

};