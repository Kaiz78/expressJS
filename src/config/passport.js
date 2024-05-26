import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as AppleStrategy } from 'passport-apple';
import  test  from '../models/usersModel.js';

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  // Here you would look up the user by their ID in your database
  findUserById(id).then(user => {
    done(null, user);
  }).catch(err => {
    done(err, null);
  });
});

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/api/google/callback'
}, async (token, tokenSecret, profile, done) => {
  try {
    const user = await test.findUserOrCreate(
      { email: profile.emails[0].value, name: profile.displayName },
      'google'
    );
    return done(null, user);

  } catch (err) {
    return done(err, false);
  }
}));


