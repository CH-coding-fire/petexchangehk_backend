require('dotenv').config();
const express = require('express')
const app = express();
const session = require('express-session');
const mongoose = require('mongoose');
const passport = require('passport');
const passportSetup = require('./passport');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
const fs = require('fs')
const Animal = require('./models/animal');

//*Above is for libraries, below is for modules
const adoptionRoute = require('./routes/adoptions');
const usersRoute = require('./routes/users');
const authRoute = require('./routes/auth');
const User = require('./models/users');
const cors = require('cors');
const animal = require('./models/animal');
const database = 'pet-service';
// const cors = require('cors')


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

const testAnimalData = async () => {
	console.log('trying to get animal data...testing');
	// console.log(typeof(Animal))
	const animals = await Animal.find()
	console.log('animal data:', animals)
}

// testAnimalData()

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.text());

app.use(
	cors({
		origin: process.env.FRONTEND_URL||'http://localhost:3000',
		methods: 'GET, POST, PUT,DELETE',
		credentials: true,
	})
);

const sessionConfig = {
	secret: 'thisshouldbeabettersecret!',
	resave: false,
	saveUninitialized: true,
	// cookie: {
	// 	// httpOnly: true,
	// 	expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
	// 	maxAge: 1000 * 60 * 60 * 24 * 7,
	// },
};

var corsOptions = {
  origin: process.env.FRONTEND_URL,
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(bodyParser.json());
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());

app.use('/adoptions', adoptionRoute);
app.use('/users', usersRoute);
app.use('/auth', cors(), authRoute);
app.get('/', (req, res) => {
	res.send('hello TESTING, successful!');
});

app.get('/req', async (req, res) => {
	console.log('from app req.user:', req.user);
	console.log('from app req.body:', req.body);
});
app.post('/req', async (req, res) => {
	console.log('from app req.user:', req.user);
	console.log('from app req.body:', req.body);
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

const connect_mode = 'express_vanilla'
const PORT = process.env.PORT || 8080;
if (connect_mode == 'express_vanilla') {
	app.listen(PORT, () => {
		const today = new Date();
		console.log(
			`*********  Express: LISTENING TO PORT: ${PORT} at ${today.getHours()}:${today.getMinutes()}:${today.getSeconds()} *********`
		);
	})
} else if (connect_mode == 'try_https') {
	httpsServer.listen(PORT, hostname, () => {
		console.log('hello...server successfully launch, remember to have "https" in the browser')
	})
}









