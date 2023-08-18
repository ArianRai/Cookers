const router = require('express').Router()
const User = require('../models/User.model')
const Recipe = require('../models/Recipe.model')
const Review = require('../models/Review.model')
const recipesApi = require('../services/recipe.service')
const { isLoggedIn, checkRoles } = require('../middlewares/route-guard')
const fileUploader = require('../config/cloudinary.config')

// Users List
router.get('/list', (req, res, next) => {
	let register = false

	User.find()
		.then(users => {
			const allUsers = users.filter(elm => elm.role === 'USER')
			const allChefs = users.filter(elm => elm.role === 'CHEF')

			if (req.session.currentUser) {
				register = true
			}
			const info = { users, register, allUsers, allChefs }
			res.render('user/user-list', info)
		})
		.catch(err => next(err))
})

// User detail
router.get('/details/:user_id/:action', (req, res, next) => {
	const { user_id, action } = req.params
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
			if (action === 'fromApi') {
				if (user.favoritesFromAPI.length !== 0) {
					const promises1 = user.favoritesFromAPI.map(eachURI => {
						return recipesApi.getOneRecipe(eachURI.split('_')[1]).then(recipe => {
							return recipe.data.recipe
						})
					})
					Promise.all(promises1).then(response => {
						res.render('user/user-details', {
							user,
							userRoles,
							userToEditRoles,
							recipesFromApi: response,
						})
					})
				} else {
					res.render('user/user-details', {
						user,
						userRoles,
						userToEditRoles,
						recipesFromApi: true,
					})
				}
			} else if (action === 'fromChefs') {
				if (user.favoritesFromChefs.length !== 0) {
					const promises2 = user.favoritesFromChefs.map(eachId => {
						return Recipe.findById(eachId)
							.populate('owner')
							.then(recipe => {
								return recipe
							})
					})
					Promise.all(promises2).then(response => {
						res.render('user/user-details', {
							user,
							userRoles,
							userToEditRoles,
							recipesFromChefs: response,
						})
					})
				} else {
					res.render('user/user-details', {
						user,
						userRoles,
						userToEditRoles,
						recipesFromChefs: true,
					})
				}
			} else if (action === 'fromMySelf') {
				Recipe.find({ owner: user_id }).then(recipesFromMySelf => {
					if (recipesFromMySelf.length !== 0) {
						res.render('user/user-details', {
							user,
							userRoles,
							userToEditRoles,
							recipesFromMySelf,
						})
					} else {
						res.render('user/user-details', {
							user,
							userRoles,
							userToEditRoles,
						})
					}
				})
			}
		})
		.catch(err => next(err))
})

// Render Edit

router.get('/edit/:user_id', isLoggedIn, (req, res, next) => {
	const { user_id } = req.params

	User.findById(user_id)
		.then(user => res.render('user/user-edit', user))
		.catch(err => next(err))
})

// Handler Edit

router.post('/edit/:user_id', isLoggedIn, fileUploader.single('avatar'), (req, res, next) => {
	const { user_id } = req.params
	const { username, email } = req.body
	let avatar = req.file?.path

	User.findByIdAndUpdate(user_id, { username, email, avatar })
		.then(user => res.redirect(`/user/details/${user._id}/fromApi`))
		.catch(err => next(err))
})

// Delete User

router.post('/delete/:user_id', isLoggedIn, checkRoles('ADMIN'), (req, res, next) => {
	const { user_id } = req.params

	User.findByIdAndDelete(user_id)
		.then(() => res.redirect(`/user/list`))
		.catch(err => next(err))
})

// Change Role
router.post('/edit-role/:user_id/:role', isLoggedIn, checkRoles('ADMIN'), (req, res, next) => {
	const { user_id, role } = req.params

	User.findByIdAndUpdate(user_id, { role })
		.then(() => res.redirect(`/user/details/${user_id}/fromMySelf`))
		.catch(err => next(err))
})

router.post('/favorite/:action', (req, res, next) => {
	const { _id: user_id } = req.session.currentUser
	const { recipe_uri } = req.body
	const { action } = req.params
	const recipe_id = recipe_uri.split('_')[1]

	recipesApi.getOneRecipe(recipe_id).then(response => {
		let { recipe } = response.data
		const calories = Math.round(recipe.calories / recipe.yield)

		let updateData, isFavorite

		if (action === 'add') {
			updateData = { $push: { favoritesFromAPI: recipe_uri } }
			isFavorite = true
		} else if (action === 'remove') {
			updateData = { $pull: { favoritesFromAPI: recipe_uri } }
			isFavorite = false
		}

		User.findByIdAndUpdate(user_id, updateData)
			.then(() => {
				res.render('recipes/recipe-details', { recipe, calories, isFavorite })
			})
			.catch(err => next(err))
	})
})

router.post('/chefs-favorite/:action', (req, res, next) => {
	const { _id: user_id } = req.session.currentUser
	const { recipe_id } = req.body
	const { action } = req.params

	let updateData, isFavorite

	if (action === 'add') {
		updateData = { $push: { favoritesFromChefs: recipe_id } }
		isFavorite = true
	} else if (action === 'remove') {
		updateData = { $pull: { favoritesFromChefs: recipe_id } }
		isFavorite = false
	}

	const promises = [
		User.findByIdAndUpdate(user_id, updateData),
		Recipe.findById(recipe_id),
		Review.find({ recipe_id }).populate('owner'),
	]

	Promise.all(promises)
		.then(([user, recipe, reviews]) => {
			res.render('recipes/chef-recipe-details', { recipe, reviews, isFavorite })
		})
		.catch(err => next(err))
})

module.exports = router
