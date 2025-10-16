// auth.js
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
require("dotenv").config(); // Carga las variables de entorno

// Estrategia de Google OAuth
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,        // Tu Client ID de Google
      clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Tu Client Secret de Google
      callbackURL: process.env.GOOGLE_CALLBACK_URL, // URL de callback
    },
    (accessToken, refreshToken, profile, done) => {
      console.log("✅ Usuario autenticado:", profile.displayName);
      return done(null, profile); // Devuelve el perfil de usuario a Passport
    }
  )
);

// Serializar usuario en sesión
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserializar usuario de sesión
passport.deserializeUser((user, done) => {
  done(null, user);
});

module.exports = passport;
