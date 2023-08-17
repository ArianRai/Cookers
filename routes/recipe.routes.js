const router = require('express').Router()
const Recipe = require('../models/Recipe.model')
const User = require('../models/User.model')
const Review = require('../models/Review.model')
const recipesApi = require('../services/recipe.service')
const fileUploader = require('../config/cloudinary.config')

const { measureTypes, cuisineTypes, mealTypes } = require('../consts/recipe-consts')
const { isLoggedIn } = require('../middlewares/route-guard')

router.get('/create', (req, res, next) => {
	res.render('recipes/create-form', { measureTypes, cuisineTypes, mealTypes })
})

router.post('/create', fileUploader.single('image'), (req, res, next) => {
	const { name, food, quantity, measure, cuisineType, mealType, totalTime } = req.body
	const { _id: user_id } = req.session.currentUser
	const ingredients = []
	const ingredientsLines = []

	let image = req.file?.path

	if (typeof food === 'object') {
		food.forEach((elm, idx) => {
			let ingredient = { quantity: quantity[idx], measure: measure[idx], food: elm }
			ingredients.push(ingredient)
			ingredientsLines.push(Object.values(ingredient).join(' '))
		})
	} else {
		ingredients.push({ quantity, measure, food })
		ingredientsLines.push(Object.values(ingredients[0]).join(' '))
	}

	const recipeInfo = {
		name,
		image,
		ingredientsLines,
		ingredients,
		cuisineType,
		mealType,
		totalTime,
		owner: user_id,
	}
	Recipe.create(recipeInfo)
		.then(() => res.redirect(`/recipe/chefs-list/${user_id}`))
		.catch(error => {
			if (error._message) {
				res.render('recipes/create-form', {
					errorMsg: error._message,
					measureTypes,
					cuisineTypes,
					mealTypes,
				})
				return
			}
			next(error)
		})
})

router.get('/list', (req, res, next) => {
	res.render('recipes/list-view', { cuisineTypes, mealTypes })
})

router.post('/list', (req, res, next) => {
	const { food, calories, cuisineType, mealType } = req.body
	const queries = { q: food, calories, cuisineType, mealType }

	if (Object.values(queries).every(val => val === '')) {
		res.render('recipes/list-view', { errorMsg: 'Fullfill at least one field for the search' })
	}

	recipesApi
		.getRecipes(queries)
		.then(response => {
			res.render('recipes/list-view', {
				recipes: response.data.hits,
				cuisineTypes,
				mealTypes,
			})
		})
		.catch(err => next(err))
})

router.post('/details', isLoggedIn, (req, res, next) => {
	const { recipe_uri } = req.body
	const recipe_id = recipe_uri.split('_')[1]
	const { _id: user_id } = req.session.currentUser

	const promises = [User.findById(user_id), recipesApi.getOneRecipe(recipe_id)]

	Promise.all(promises)
		.then(([user, data]) => {
			const isFavorite = user.favoritesFromAPI.includes(recipe_uri)
			let { recipe } = data.data
			const calories = Math.round(recipe.calories / recipe.yield)
			res.render('recipes/recipe-details', { recipe, calories, isFavorite })
		})
		.catch(err => next(err))
})

router.get('/chefs-list/:id', (req, res, next) => {
	const { id: user_id } = req.params

	const query = user_id === 'none' ? {} : { owner: user_id }

	Recipe.find(query)
		.populate('owner')
		.then(response => res.render('recipes/chefs-recipes-list', { recipes: response }))
		.catch(err => next(err))
})

router.post('/recipe-chef-details', (req, res, next) => {
	const { id: recipeID } = req.body
	const { _id: user_id } = req.session.currentUser
	const promises = [
		User.findById(user_id),
		Recipe.findById(recipeID),
		Review.find({ recipeID }).populate('owner'),
	]

	Promise.all(promises)
		.then(([user, recipe, reviews]) => {
			const isFavorite = user.favoritesFromChefs.includes(recipeID)
			res.render('recipes/chef-recipe-details', { recipe, reviews, isFavorite })
		})
		.catch(err => next(err))
})

module.exports = router
