const passport = require('passport');
const Users = require('../models/users');
const router = require('express').Router();
const cors = require('cors');
const { targetClientURL } = require('../urlClientAndServer');
const { thisServerURL } = require('../urlClientAndServer');
const { consolelogMiddleWare } = require('../middleware');

// router.use(
// 	cors({
// 		origin: targetClientURL,
// 		methods: 'GET, POST, PUT,DELETE',
// 		credentials: true,
// 	})
// );
//
router.get(
	'/google',consolelogMiddleWare,
	passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
	'/google/callback',consolelogMiddleWare, //*ok, testing indicated that this is reached
		passport.authenticate('google', {
		successRedirect: targetClientURL,
		//*Ok, it is proven that it is successful, why req.user is not working
		failureRedirect: '/login/failed',
		})
);

// Run after it auth from google is successful
// router.get('/login/success', cors({
// 	origin: process.env.FRONTEND_URL
// 	,
// 		methods: 'GET, POST, PUT,DELETE, HEAD',
// 		credentials: true,
// 	}), async (req, res) => {
// 	console.log('REQ.USER:LOGIN/SUCCESS', req.user);
// 	res.status(200).json({ 'status': 'ok' })
// 	if (req.user) {
// 		let user = await Users.find({ userId: req.user.id }).then(async (user) => {
// 			console.log('see if user param is passed', user);
// 			if (user.length !== 0) {
// 				console.log('this user has userId, he already registed!!');
// 			} else {
// 				console.log('this use is new... building new userId...');
// 				await Users.create({ userId: req.user.id });
// 			}
// 			// console.log('USER_NICK', user.[].nickname);
// 			res.status(200).json({
// 				success: true,
// 				// message: 'successful nice',
// 				thirdPartyUser: req.user,
// 				nickname: user[0].nickname,
// 				contact: user[0].contact,
// 				cookies: req.cookies,
// 			});
// 		});
// 	}
// });

router.get('/login/success', async (req, res) => {
	console.log('req', req)
	console.log('REQ.USER:LOGIN/SUCCESS', req.user);
	// console.log('from app req.session: (wide app)', req)
	if (req.user) {
		console.log('try finding user')
		//* ok, I already know that the below code will not execute if req.user is undefined
		//* req.user is undefined now, but in what situation it will be defined?
		//* so, I guess if frontend embedded cookie, the server will recognize it
		//* and then in req.user have information
		let user = await Users.find({ userId: req.user.id }).then(async (user) => {
			console.log('see if user param is passed', user);
			if (user.length !== 0) {
				console.log('this user has userId, he already registed!!');
			} else {
				console.log('this use is new... building new userId...');
				await Users.create({ userId: req.user.id });
			}
			// console.log('USER_NICK', user.[].nickname);
			res.status(200).json({
				success: true,
				// message: 'successful nice',
				thirdPartyUser: req.user,
				nickname: user[0].nickname,
				contact: user[0].contact,
				cookies: req.cookies,
			});
		});
	}
	if (!req.user) {
			console.log('req.user is uedefined....')
		res.json({
			success:false
		})
	}
	// res.status(444).json({ 'login': 'false' }) //*
});

router.get('/login/failed', (req, res) => {
	console.log('login failed...');
	res.status(401).json({
		success: false,
		message: 'Login failure...',
	});
});

router.get('/logout', (req, res) => {
	console.log('REQ.USER:logout', req.user);
	req.logout();
	res.redirect(targetClientURL);
});






// router.get('/facebook',
//   passport.authenticate('facebook'));

// router.get('/facebook/callback',
// 	passport.authenticate('facebook',
// 		{
// 			successRedirect: targetClientURL,
// 			failureRedirect: '/login'
// 		}),
//   function(req, res) {
//     // Successful authentication, redirect home.
//     res.redirect('/');
//   });

module.exports = router;
