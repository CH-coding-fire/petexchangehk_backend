const passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require("passport-facebook").Strategy
const { targetClientURL } = require('./urlClientAndServer');
const { thisServerURL } = require('./urlClientAndServer');



passport.use(new GoogleStrategy({
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
	callbackURL: `${ thisServerURL }/auth/google/callback`,
		},
		function (accessToken, refreshToken, profile, done) {
			done(null, profile);
		}
	)
);

// console.log(`${ thisServerURL } /auth/facebook/callback`)


// passport.use(new FacebookStrategy({
//     clientID: process.env.CLIENT_ID_FB,
//     clientSecret: process.env.CLIENT_SECRET_FB,
//     callbackURL: `${ thisServerURL } /auth/facebook/callback`
//   },
//   function(accessToken, refreshToken, profile, cb) {
//     User.findOrCreate({ userId: profile.id }, function (err, user) {
//       return cb(err, user);
//     });
//   }
// ));

passport.serializeUser((user, done) => {
	console.log(`serialize: user:${user}`)
	done(null, user);
});

passport.deserializeUser((user, done) => {
	console.log(`deserialize user:${user}`)
	done(null, user);
});

// passport.serializeUser(Users.serializeUser());

// passport.deserializeUser(Users.deserializeUser());

// console.log('hello from passport');
