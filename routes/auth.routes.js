const router = require('express').Router()
const bcrypt = require('bcryptjs')
const User = require('../models/User.model')

const saltRounds = 10

router.get('/signup', (req, res, next) => res.render('auth/signup-form'))
router.post('/signup', (req, res, next) => {
	const { username, email, plainPassword, role, avatar } = req.body

	bcrypt
		.genSalt(saltRounds)
		.then(salt => bcrypt.hash(plainPassword, salt))
		.then(hashedPassword =>
			User.create({ username, email, password: hashedPassword, role, avatar })
		)
		.then(() => res.redirect('/'))
		.catch(error => next(error))
})

router.get('/login', (req, res, next) => {
	const { err: errorMessage } = req.query
	res.render('auth/login', { errorMessage })
	res.render('/auth/login-form')
})
router.post('/login', (req, res, next) => {
	const { email, plainPassword } = req.body

	User.findOne({ email })
		.then(user => {
			if (!user) {
				res.render('auth/login', {
					errorMessage: 'There is no account with this email',
				})
				return
			} else if (bcrypt.compareSync(plainPassword, user.password) === false) {
				res.render('auth/login', { errorMessage: 'Incorrect password' })
				return
			} else {
				// req.session.currentUser = user
				res.redirect('/')
			}
		})
		.catch(error => next(error))
})

router.post('/logout', (req, res, next) => {
	req.session.destroy(() => res.redirect('/login'))
})

module.exports = router
