import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';

const configurePassport = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID || 'dummy_client_id',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'dummy_client_secret',
        callbackURL: '/api/auth/google/callback',
        proxy: true,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if user already exists
          let user = await User.findOne({ googleId: profile.id });
          if (user) {
            return done(null, user);
          }

          // If not, check if user exists with same email
          const email = profile.emails && profile.emails[0] ? profile.emails[0].value : '';
          if (email) {
            user = await User.findOne({ email });
            if (user) {
              user.googleId = profile.id;
              if (!user.profileImage) {
                user.profileImage = profile.photos && profile.photos[0] ? profile.photos[0].value : '';
              }
              await user.save();
              return done(null, user);
            }
          }

          // Create new user
          user = await User.create({
            name: profile.displayName,
            email: email || `${profile.id}@google.com`,
            googleId: profile.id,
            profileImage: profile.photos && profile.photos[0] ? profile.photos[0].value : '',
            role: 'user', // Default role
          });

          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );

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
};

export default configurePassport;
