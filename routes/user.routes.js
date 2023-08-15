const router = require('express').Router()
const User = require('../models/User.model')
const recipesApi = require('../services/recipe.service')

const { isLoggedIn, checkRoles } = require('../middlewares/route-guard')
const fileUploader = require('../config/cloudinary.config')

// Users detail
router.get('/list', (req, res, next) => {
	let register = false

	User.find()
		.then(users => {
			if (req.session.currentUser) {
				register = true
			}
			res.render('user/user-list', { users, register })
		})
		.catch(err => next(err))
})

// User detail
router.get('/:user_id/details', (req, res) => {
	const { user_id } = req.params

	const userRoles = {
		isAdmin: req.session.currentUser?.role === 'ADMIN',
	}

	User.findById(user_id)
		.then(user => {
			const userToEditRoles = {
				isUser: user.role === 'USER',
				isChef: user.role === 'CHEF',
			}

			res.render('user/user-details', { user, userRoles, userToEditRoles })
		})
		.catch(err => console.log(err))
})

// Render Edit

router.get('/:user_id/edit', isLoggedIn, (req, res) => {
	const { user_id } = req.params

	User.findById(user_id)
		.then(user => res.render('user/user-edit', user))
		.catch(err => console.log(err))
})

// Handler Edit

router.post('/:user_id/edit', isLoggedIn, fileUploader.single('avatar'), (req, res) => {
	const { user_id } = req.params
	const { username, email } = req.body
	const { path: avatar } = req.file

	User.findByIdAndUpdate(user_id, { username, email, avatar })
		.then(user => res.redirect(`/user/${user._id}/details`))
		.catch(err => console.log(err))
})

// Delete User

router.post('/:user_id/delete', isLoggedIn, checkRoles('ADMIN'), (req, res) => {
	const { user_id } = req.params

	User.findByIdAndDelete(user_id)
		.then(() => res.redirect(`/user/list`))
		.catch(err => console.log(err))
})

// Change Role
router.post('/:user_id/edit/:role', isLoggedIn, checkRoles('ADMIN'), (req, res) => {
	const { user_id, role } = req.params

	User.findByIdAndUpdate(user_id, { role })
		.then(() => res.redirect(`/user/${user_id}/details`))
		.catch(err => console.log(err))
})

router.post('/favorite/:action', (req, res, next) => {
	const { _id: user_id } = req.session.currentUser
	const { recipe_uri } = req.body
	const { action } = req.params
	const recipe_id = recipe_uri.split('_')[1]

	if (action === 'add') {
		User.findByIdAndUpdate(user_id, { $push: { favoritesFromAPI: recipe_uri } }).then(user =>
			recipesApi.getOneRecipe(recipe_id).then(response => {
				const isFavorite = true
				let { recipe } = response.data
				const calories = Math.round(recipe.calories / recipe.yield)
				res.render('recipes/recipe-details', { recipe, calories, isFavorite })
			})
		)
	} else if (action === 'deletes') {
		User.findByIdAndUpdate(user_id, { $pull: { favoritesFromAPI: recipe_uri } }).then(user =>
			recipesApi.getOneRecipe(recipe_id).then(response => {
				const isFavorite = false
				let { recipe } = response.data
				const calories = Math.round(recipe.calories / recipe.yield)
				res.render('recipes/recipe-details', { recipe, calories, isFavorite })
			})
		)
	}
})


router.get("/profile", isLoggedIn, (req, res) => {

  console.log('EL USUARIO LOGUEADO ES', req.session.currentUser)

  res.render("user/user-details", { loggedUser: req.session.currentUser });
})

module.exports = router

module.exports = router
