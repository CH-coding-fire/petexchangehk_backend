require('dotenv').config();
const express = require('express')
const app = express();
const session = require('express-session');
const mongoose = require('mongoose');
const passport = require('passport');
const passportSetup = require('./passport');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
// const fs = require('fs')
const Animal = require('./models/animal');

//*Above is for libraries, below is for modules
const adoptionRoute = require('./routes/adoptions');
const usersRoute = require('./routes/users');
const authRoute = require('./routes/auth');
const User = require('./models/users');
const cors = require('cors');
const animal = require('./models/animal');
const database = 'pet-service';
var cookieParser = require('cookie-parser');
const { targetClientURL } = require('./urlClientAndServer');
const { thisServerURL } = require('./urlClientAndServer');
const { cookiesLogger } = require('./middleware');
//If .env file have localhost:3000, then it will run it localhost, if not, it runs in deployment


//Connect to the database, Atlas or local
mongoose
	.connect(`${process.env.MONGODB_ATLAS_URL_PET_SERVICE}` || `mongodb://localhost:27017/${database}`, {

		useNewUrlParser: true,
		useUnifiedTopology: true,

	})
	.then(() => {
		try {
			const today = new Date();
			console.log(
					`*********   MongoDB database ${database} CONNNECTION OPEN! at ${today.getHours()}:${today.getMinutes()}:${today.getSeconds()} *********`
				)
		} catch (error) {
			console.log(`ERROR!! ${database} mongoDB connection FAILED!!!`);
			throw new Error(error.message)
		}
	});

//Just for testing
const testAnimalData = async () => {
	console.log('trying to get animal data...testing');
	// console.log(typeof(Animal))
	const animals = await Animal.find()
	console.log('animal data:', animals)
}
// testAnimalData()

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use(bodyParser.text());
// app.use(
	// cors({
	// 	origin: targetClientURL,
	// 	credentials: true,
	// })


app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', targetClientURL);
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(cookieParser());
console.log('the targetClientURL is: ', targetClientURL)
app.use(cookiesLogger)

//! This needs attention later because of that secret.
const sessionConfig = {
	secret: process.env.COOKIE_SECRET,
	resave: false,
	saveUninitialized: false,
	cookie: {
		expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
		maxAge: 1000 * 60 * 60 * 24 * 7,
		// domain: thisServerURL,
		// domain: targetClientURL,
		// domain: 'petexchangehk-frontend.vercel.app',
		domain: 'fuckyoubitch.com',

		// sameSite: true,
		// secure: true,
		// httpOnly:true
	},
};
app.set('trust proxy', 1);
app.use(session(sessionConfig));
app.use(bodyParser.json());
//so express use session, and session is config above
//
app.use(passport.initialize());
app.use(passport.session()); //This is a application-level middleware,
//the session itself can be authenticated using the built-in session strategy

//Below are the routes!
app.use('/adoptions', adoptionRoute);
app.use('/users', usersRoute);
app.use('/auth', authRoute);

//Testing if server works
app.get('/', (req, res) => {
	res.send('hello TESTING, successful!');

});

// ! I forgot what is this
app.get('/req', async (req, res) => {
	console.log('from app req.user:', req.user);
	console.log('from app req.cookies:', req.cookies);
	// console.log('from app req.session:' ,req.session)
	// res.json({ 'req.user': req.user, 'req.body': req.body })
	res.end(`The req.user is ${req.user}`)
});



// const https = require('https');
// const hostname = "localhost"
// const httpsOptions = {
// 	cert: fs.readFileSync('./ssl/www_petexchangehk_com.crt'),
// 	ca: fs.readFileSync('./ssl/www_petexchangehk_com.ca-bundle'),
// 	// key: fs.readFileSync('./ssl/csr.pem'),
// 	key: fs.readFileSync('./ssl/private.key'),
// }
// const httpsServer = https.createServer(httpsOptions, app)
//method from https://adamtheautomator.com/https-nodejs/
// https.createServer(httpsOptions,app).listen(PORT, () => {
// 	console.log('server is running at port 8080')
// })

// todo Change this only vanilla later
const connect_mode = 'express_vanilla'
const PORT = process.env.PORT || 8080;
if (connect_mode == 'express_vanilla') {
	app.listen(PORT, () => {
		const today = new Date();
		console.log(
			`*********  Express: LISTENING TO PORT: ${PORT} at ${today.getHours()}:${today.getMinutes()}:${today.getSeconds()} *********`
		);
		console.log(`The URL of frontend is ${targetClientURL}`)
	})
} else if (connect_mode == 'try_https') {
	httpsServer.listen(PORT, hostname, () => {
		console.log('hello...server successfully launch, remember to have "https" in the browser')
	})
}










