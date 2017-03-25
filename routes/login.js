module.exports = function(app, passport) {

//Routes
router.get('/', function(req, res){
         res.render('login.ejs', { title: 'Login', message: req.flash('loginMessage') });
});

router.post('/',function(req,res) {
    
});

}