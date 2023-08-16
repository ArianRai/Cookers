const router = require('express').Router()
const User = require('../models/User.model')
const recipesApi = require('../services/recipe.service')
const { isLoggedIn, checkRoles } = require('../middlewares/route-guard')
const fileUploader = require('../config/cloudinary.config')
const { response } = require('express')
const Recipe = require('../models/Recipe.model')

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
router.get('/details/:user_id', (req, res) => {
	const { user_id } = req.params

	const userRoles = {
		isAdmin: req.session.currentUser?.role === 'ADMIN',
		isMyself: req.session.currentUser?._id === user_id,
	}

	User.findById(user_id)
		.then(user => {
			const userToEditRoles = {
				isUser: user.role === 'USER',
				isChef: user.role === 'CHEF',
			}
			if (user.favoritesFromAPI.length) {
				Promise.all(
					user.favoritesFromAPI.map(eachURI => {
						return recipesApi.getOneRecipe(eachURI.split('_')[1]).then(recipe => {
							return recipe.data.recipe
						})
					})
				).then(response => {
					res.render('user/user-details', {
						user,
						userRoles,
						userToEditRoles,
						recipes: response,
					})
				})
			} else {
				res.render('user/user-details', {
					user,
					userRoles,
					userToEditRoles,
				})
			}
		})
		.catch(err => next(err))
})

// Render Edit

router.get('/edit/:user_id', isLoggedIn, (req, res) => {
	const { user_id } = req.params

	User.findById(user_id)
		.then(user => res.render('user/user-edit', user))
		.catch(err => console.log(err))
})

// Handler Edit

router.post(
	'/edit/:user_id',
	isLoggedIn,
	fileUploader.single('avatar'),
	(req, res) => {
		const { user_id } = req.params
		const { username, email } = req.body
		const { path: avatar } = req.file

		User.findByIdAndUpdate(user_id, { username, email, avatar })
			.then(user => res.redirect(`/user/details/${user._id}`))
			.catch(err => console.log(err))
	}
)

// Delete User

router.post('/delete/:user_id', isLoggedIn, checkRoles('ADMIN'), (req, res) => {
	const { user_id } = req.params

	User.findByIdAndDelete(user_id)
		.then(() => res.redirect(`/user/list`))
		.catch(err => console.log(err))
})

// Change Role
router.post('/edit-role/:user_id/:role', isLoggedIn, checkRoles('ADMIN'), (req, res) => {
	const { user_id, role } = req.params

	User.findByIdAndUpdate(user_id, { role })
		.then(() => res.redirect(`/user/details/${user_id}/`))
		.catch(err => console.log(err))
})

router.post('/favorite/:action', (req, res, next) => {
	const { _id: user_id } = req.session.currentUser
	const { recipe_uri } = req.body
	const { action } = req.params
	const recipe_id = recipe_uri.split('_')[1]

	recipesApi.getOneRecipe(recipe_id).then(response => {
		let { recipe } = response.data
		const calories = Math.round(recipe.calories / recipe.yield)

		if (action === 'add') {
			User.findByIdAndUpdate(user_id, { $push: { favoritesFromAPI: recipe_uri } }).then(
				() => {
					res.render('recipes/recipe-details', { recipe, calories, isFavorite: true })
				}
			)
		}

		if (action === 'remove') {
			User.findByIdAndUpdate(user_id, { $pull: { favoritesFromAPI: recipe_uri } }).then(
				() => {
					res.render('recipes/recipe-details', { recipe, calories, isFavorite: false })
				}
			)
		}
	})
})

router.post('/chefs-favorite/:action', (req, res, next) => {
	const { _id: user_id } = req.session.currentUser
	const { recipe_id } = req.body
	const { action } = req.params

	// console.log(req.body)

	if (action === 'add') {
		User.findByIdAndUpdate(user_id, { $push: { favoritesFromChefs: recipe_id } }).then(() =>
			Recipe.findById(recipe_id).then(recipe => {
				res.render('recipes/chef-recipe-details', { recipe, isFavorite: true })
			})
		)
	}

	if (action === 'remove') {
		User.findByIdAndUpdate(user_id, { $pull: { favoritesFromChefs: recipe_id } }).then(() =>
			Recipe.findById(recipe_id).then(recipe => {
				res.render('recipes/chef-recipe-details', { recipe, isFavorite: false })
			})
		)
	}
})

module.exports = router
