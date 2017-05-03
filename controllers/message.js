var twilio = require('twilio');
var config = require('../config');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');


// Create an authenticated Twilio REST API client
var client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Render a form that will allow the user to send a text (or picture) message 
// to a phone number they entered.
exports.showSendMessage = function(request, response) {
    console.log(config)
    response.render('sendMessage', {
        title: 'Sending Messages with Twilio'
    });
};

// Handle a form POST to send a message to a given number
exports.sendMessage = function(req, res) {
    client.sendMessage({ 
        to: req.body.toNumber, 
        from: config.twilioNumber, 
        body: req.body.message,
    }, function(err, message) { 
        if(err){
            console.log('from: ', config.twilioNumber)
            console.log(err);
        } else {
            res.render('receiveMessage', {
                title: 'You sent message with Twilio'
            });
        }
        mongoose.model('Message').create({
            to: req.body.toNumber, 
            from: config.twilioNumber, 
            body: req.body.message,
            SID: message.sid,
        })
    });
};

// Show a page displaying text/picture messages that have been sent to this
// web application, which we have stored in the database
exports.showReceiveMessage = function(req, res) {
    var Message = mongoose.model('Message');
    Message.find({}, function(err, messages) {
        if (err) {
        return console.log(err);
        } else {
        res.render('messages.ejs', {
            user: req.user,
            messages: messages // get the user out of session and pass to template
        });
        }
    });
};

function isNumber(input) {
    return !isNaN( input );
}
// Handle a POST request from Twilio for an incoming message
exports.receiveMessageWebhook = function(req, res) {
    var twiml = new twilio.TwimlResponse();
    var body = req.body.Body
    var from = req.body.From

    var amount = body.split(/[ ]+/).pop();
    if ((/donate/).test(body.toLowerCase())) {
        if (!isNumber(amount)) {
            amount = ''
        }
        twiml.message('Thank you for donating to Blue Mountain Clinic. To make your donation online please follow this link: paypal.me/sreahard/' + amount);
    } else {
        twiml.message('We did not understand your message, to learn more about Blue Mountain Clinic visit www.bluemountainclinic.org/. To make a donation visit paypal.me/sreahard/');
    }
    mongoose.model('Message').create({
        from: req.body.From, 
        body: req.body.Body,
        amount: isNumber(amount) ? amount : null,
        messageSid: req.body.MessageSid,
        fromCity: req.body.FromCity,
        fromState: req.body.FromState,
        fromZip: req.body.FromZip,
        fromCountry: req.body.FromCountry,
    })
    res.writeHead(200, {'Content-Type': 'text/xml'});
    res.end(twiml.toString());
};

// Update the configured Twilio number for this demo to send all incoming
// messages to this server.
exports.configureNumber = function(request, response) {

};