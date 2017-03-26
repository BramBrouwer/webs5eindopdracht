module.exports = function(app, passport) {

//Routes
app.get('/login', function(req, res){
         res.render('login.ejs', { title: 'Login', message: req.flash('loginMessage') });
});

  //Local login
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));
    
   //Google login 
   app.get('/login/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

     // Google login callback
    app.get('/login/google/callback',
            passport.authenticate('google', {
                    successRedirect : '/profile',
                    failureRedirect : '/'
            }));

}