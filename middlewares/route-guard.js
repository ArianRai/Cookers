const updateloggedUser = (req, res, next) => {
	res.locals.loggedUser = req.session.currentUser
	res.locals.isChef = req.session?.currentUser?.role === 'CHEF'
	next()
}

const isLoggedIn = (req, res, next) => {
	if (req.session.currentUser) {
		next()
	} else {
		res.redirect('/auth/login?err=Login to access')
	}
}

const isLoggedOut = (req, res, next) => {
	if (!req.session.currentUser) {
		next()
	} else {
		res.redirect('/')
	}
}

const checkRoles =
	(...admittedRoles) =>
	(req, res, next) => {
		const { role } = req.session.currentUser

		if (admittedRoles.includes(role)) {
			next()
		} else {
			res.redirect('/login?err=You are not authorized')
		}
	}

module.exports = {
	isLoggedIn,
	isLoggedOut,
	checkRoles,
	updateloggedUser,
}
