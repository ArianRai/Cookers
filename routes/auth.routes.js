const router = require('express').Router()
const bcrypt = require('bcryptjs')
const User = require('../models/User.model')

const fileUploader = require('../config/cloudinary.config')

const saltRounds = 10

router.get('/signup', (req, res, next) => res.render('auth/signup-form'))

router.post('/signup', fileUploader.single('avatar'), (req, res, next) => {
	// const { username, email, plainPassword, role, avatar } = req.body
	const { username, email, plainPassword } = req.body
	// const { path: avatar } = req.file

	let avatar = req.file?.path

	bcrypt
		.genSalt(saltRounds)
		.then(salt => bcrypt.hash(plainPassword, salt))
		.then(hashedPassword =>
			// User.create({ username, email, password: hashedPassword, role, avatar })
			User.create({ username, email, password: hashedPassword, avatar })
		)
		.then(() => res.redirect('/'))
		.catch(error => next(error))
})

router.get('/login', (req, res, next) => {
	const { err: errorMessage } = req.query
	res.render('auth/login-form', { errorMessage })
})
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
