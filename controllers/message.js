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
exports.showReceiveMessage = function(request, response) {
    response.render('receiveMessage', {
        title: 'Sending Messages with Twilio'
    });
};

// Handle a POST request from Twilio for an incoming message
exports.receiveMessageWebhook = function(req, res) {
    // if (req.method == 'POST') {
    //     var body = '';

    //     req.on('data', function (data) {
    //         body += data;
    //     });

    //     req.on('end', function () {

    //         var POST = qs.parse(body);
    //         // use POST

    //         //validate incoming request is from twilio
    //         var token = config.authToken,
    //             header = req.headers['x-twilio-signature'];

    //         console.log('headers: '+ JSON.stringify(req.headers));

    //         console.log('Got Twilio Header: '+header);
    //         console.log('Got POST params: '+JSON.stringify(POST));

    //         if (twilio.validateRequest(token, header, 'http://twilio-raw.herokuapp.com', POST)) {
    //             //generate a TwiML response
    //             var resp = new twilio.TwimlResponse();
    //             resp.say('hello, twilio!');

    //             res.writeHead(200, {
    //                 'Content-Type':'text/xml'
    //             });
    //             res.end(resp.toString());
    //         }
    //         else {
    //             res.writeHead(200, {
    //                 'Content-Type':'text/plain'
    //             });
    //             res.end('you are not twilio - take a hike.');
    //         }
    //     });
    // }
    // else {
    //     res.writeHead(200, {
    //         'Content-Type':'text/plain'
    //     });
    //     res.end('send a POST.');
    // }

};

// Update the configured Twilio number for this demo to send all incoming
// messages to this server.
exports.configureNumber = function(request, response) {

};