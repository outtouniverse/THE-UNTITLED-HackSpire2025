const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const config = require('./config');
require('dotenv').config();
// Define serialize and deserialize inside passport.js
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

passport.use(new GoogleStrategy({
    clientID: "703416968026-taanardsak8q6snjf0r02p7ts5an2v7g.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ googleId: profile.id });

      if (!user) {
        user = await User.create({
          googleId: profile.id,
          displayName: profile.displayName,
          email: profile.emails[0].value,
          profilePicture: profile.photos[0].value
        });
      }

      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }
));

// Important: Export passport so it can be imported elsewhere!
module.exports = passport;
