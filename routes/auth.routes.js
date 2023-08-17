const router = require('express').Router()
const bcrypt = require('bcryptjs')
const User = require('../models/User.model')
const fileUploader = require('../config/cloudinary.config')
const saltRounds = 10

// Render SignUP
router.get('/signup', (req, res, next) => res.render('auth/signup-form'))

// Handler SignUP
router.post('/signup', fileUploader.single('avatar'), (req, res, next) => {
	const { username, email, plainPassword } = req.body
	let avatar = req.file?.path

	bcrypt
		.genSalt(saltRounds)
		.then(salt => bcrypt.hash(plainPassword, salt))
		.then(hashedPassword => User.create({ username, email, password: hashedPassword, avatar }))
		.then(() => res.redirect('/'))
		.catch(error => next(error))
})

// Render Login
router.get('/login', (req, res, next) => {
	const { err: errorMessage } = req.query
	res.render('auth/login-form', { errorMessage })
})

// Handler Login
router.post('/login', (req, res, next) => {
	const { email, plainPassword } = req.body

	User.findOne({ email })
		.then(user => {
			if (!user) {
				res.render('auth/login-form', {
					errorMessage: 'There is no account with this email',
				})
				return
			} else if (bcrypt.compareSync(plainPassword, user.password) === false) {
				res.render('auth/login', { errorMessage: 'Incorrect password' })
				return
			} else {
				req.session.currentUser = user
				res.redirect('/')
			}
		})
		.catch(error => next(error))
})

router.get('/logout', (req, res, next) => {
	req.session.destroy(() => res.redirect('/'))
})

module.exports = router
