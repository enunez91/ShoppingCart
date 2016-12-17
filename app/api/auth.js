require('dotenv').config();
module.exports = function(User,app){
  var connection = require('../settings/connectionString');
  var express = require('express');
  var passport = require('passport');
  var FacebookStrategy = require('passport-facebook').Strategy;

  passport.use(new FacebookStrategy({
    clientID:process.env.FACEBOOK_APP_ID,
    clientSecret:process.env.FACEBOOK_APP_SECRET,
    callbackURL:connection.SERVER_URL_ROOT + '/auth/facebook/callback',
    profileFields: ['id', 'emails', 'name']
  },
  function(accessToken, refreshToken, profile, cb){
    
    if (!profile.emails || !profile.emails.length) {
        return cb('No emails associated with this account!');
    }
    User.findOneAndUpdate(
      {
        'data.oauth':profile.id
      },
      {
        $set: {
            'profile.username': profile.emails[0].value,
            'profile.picture': 'http://graph.facebook.com/' +
              profile.id.toString() + '/picture?type=large'
          }
      },
      {
        'new':true, upsert:true, runValidators:true
      },
      function(error,user){
        cb(error,user);
      }
    );
  }));

  passport.serializeUser(function(user, done) {
    done(null, user._id);
  });

  passport.deserializeUser(function(id, done) {
    User.
      findOne({ _id : id }).
      exec(done);
  });

  app.use(passport.initialize());
  app.use(passport.session());

  app.use(require('express-session')({
    secret: 'this is a secret'
  }));

  app.get('/auth/facebook',
    passport.authenticate('facebook', { scope: ['email'] }),
    function(req,res){
      res.redirect('/');
    });

  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/fail' }),
    function(req, res) {
      res.send('Welcome, ' + req.user.profile.username);
    });
};
