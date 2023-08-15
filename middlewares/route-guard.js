
const updateloggedUser = (req, res, next) => {
    res.locals.loggedUser = req.session.currentUser
    next()
}

const isLoggedIn = (req, res, next) => {
	if (req.session.currentUser) {
		next()
	} else {
		res.redirect('/login?err=Login to access')
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
