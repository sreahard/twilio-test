var home = require('./home');
var message = require('./message');
var basic = require('../middleware/basic-auth');

// Map routes to controller functions
module.exports = function(app, passport) {

    app.get('/', home.show);

    app.get('/login', function(req, res) {
		res.render('index.ejs', { message: req.flash('loginMessage') });
	});

	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/messages', // redirect to the secure profile section
		failureRedirect : '/login', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

    // app.get('/messages', isLoggedIn, function(req, res) {
    //     res.render('messages.ejs', {
    //         user: req.user,
    //         messages: req.messages // get the user out of session and pass to template
    //     });
    // });

    app.get('/signup', function(req, res) {
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/messages', 
        failureRedirect: '/signup', 
        failureFlash: true,
    }));

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated())
            return next();
        res.redirect('/');
    }
    // Routes for messaging examples
    app.get('/message/send', message.showSendMessage);
    app.post('/message/send', basic, message.sendMessage);
    app.get('/messages', isLoggedIn, message.showReceiveMessage);
    app.post('/message', message.receiveMessageWebhook);
    app.post('/message/configure', basic, message.configureNumber);
};