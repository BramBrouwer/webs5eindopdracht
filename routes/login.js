module.exports = function(app, passport) {

//Routes
app.get('/login', function(req, res){
         res.render('login.ejs', { title: 'Login', message: req.flash('loginMessage') });
});

  // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));
}