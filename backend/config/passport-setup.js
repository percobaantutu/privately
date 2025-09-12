import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/userModel.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Find if the user already exists in our DB
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          // If user exists, pass them to the next middleware
          return done(null, user);
        } else {
          // If user doesn't exist, check if email is already in use
          user = await User.findOne({ email: profile.emails[0].value });
          if (user) {
            // If email exists, link the Google account
            user.googleId = profile.id;
            await user.save();
            return done(null, user);
          } else {
            // If email doesn't exist, create a new user
            const newUser = new User({
              googleId: profile.id,
              fullName: profile.displayName,
              email: profile.emails[0].value,
              profilePicture: profile.photos[0].value,
              // All new Google sign-ups are students by default and are pre-verified
              role: "student",
              isVerified: true,
            });
            await newUser.save();
            return done(null, newUser);
          }
        }
      } catch (error) {
        return done(error, null);
      }
    }
  )
);
