var twilio = require('twilio');
var cfg = require('../config');

// Create an authenticated Twilio REST API client
var client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

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
        to: "+14062405245", 
        from: "+15005550006", 
        body: request.body.message, 
        mediaUrl: "https://c1.staticflickr.com/3/2899/14341091933_1e92e62d12_b.jpg",  
    }, function(err, message) { 
        if(err){
            console.log(err);
        } else {
            console.log('message sid is: ', message.sid);
            response.redirect('/message/send')
        }
    });
};

// Show a page displaying text/picture messages that have been sent to this
// web application, which we have stored in the database
exports.showReceiveMessage = function(request, response) {
    response.render('receiveMessage', {
        title: 'Sending Messages with Twilio'
    });
};

// Handle a POST request from Twilio for an incoming message
exports.receiveMessageWebhook = function(request, response) {

};

// Update the configured Twilio number for this demo to send all incoming
// messages to this server.
exports.configureNumber = function(request, response) {

};