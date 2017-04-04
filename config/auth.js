// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

      'googleAuth' : {
        'clientID'      : '505802495786-fr9e77vv2q7ufa0thvmvvd6u1bqocjgd.apps.googleusercontent.com',
        'clientSecret'  : 'dlCzAaKuvK7PpHHWa5zgN2Bq',
        'callbackURL'   : 'http://localhost:3000/login/google/callback'
    },
      'twitterAuth' : {
        'consumerKey'       : '3kfGuirnBAafCXbSL9nijflp8',
        'consumerSecret'    : 'NcfGgzBE8SrAS9jeBP5hTn13Hvahn1RsZc9Dx2SmwaMWJL2xok',
        'callbackURL'       : 'http://localhost:3000/login/twitter/callback'
    }
};