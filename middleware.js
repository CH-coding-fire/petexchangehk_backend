module.exports.isLoggedIn = (req, res, next) => {
	console.log('login?', req.isAuthenticated());
	if (!req.isAuthenticated()) {
		return res.redirect('/');
	}
	next();
};

module.exports.consolelogMiddleWare = (req, res, next) => {
	console.log('reached!')
	console.log(req.originalUrl)
	next();
};

module.exports.console_log_cookies = (req, res, next) => {
	console.log('printing req.cookies...: ', req.cookies)
	next();
};