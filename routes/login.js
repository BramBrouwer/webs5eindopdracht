module.exports = function(app, passport) {

//Routes
app.get('/', function(req, res){
         res.render('login.ejs', { title: 'Login', message: req.flash('loginMessage') });
});

app.post('/',function(req,res) {
    
});

}