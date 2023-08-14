const router = require('express').Router()
const Recipe = require('../models/Recipe.model')

const axios = require('axios')

router.get('/create', (req, res, next) => {
	const measureTypes = [
		'Gram',
		'Kilogram',
		'Pinch',
		'Liter',
		'Quart',
		'Milliliter',
		'Drop',
		'Cup',
		'Tablespoon',
		'Teaspoon',
	]
	const cuisineTypes = [
		'American',
		'Asian',
		'British',
		'Caribbean',
		'Central Europe',
		'Chinese',
		'Eastern Europe',
		'French',
		'Indian',
		'Italian',
		'Japanese',
		'Kosher',
		'Mediterranean',
		'Mexican',
		'Middle Eastern',
		'Nordic',
		'South American',
		'South East Asian',
	]
	const mealTypes = ['Breakfast', 'Dinner', 'Lunch', 'Snack', 'Teatime']
	res.render('recipes/create-form', { measureTypes, cuisineTypes, mealTypes })
})

router.post('/create', (req, res, next) => {
	const { name, image, food, quantity, measure, cuisinType, mealType } = req.body
	const ingredients = []
	food.forEach((elm, idx) => {
		let ingredient = { food: elm, quantity: quantity[idx], measure: measure[idx] }
		ingredients.push(ingredient)
	})
	const recipeInfo = {
		name,
		image,
		ingredients,
		cuisinType,
		mealType,
	}
	Recipe.create(recipeInfo)
		.then(recipeCreated => res.send(recipeCreated))
		.catch(error => next(error))
})

router.get('/list', (req, res, next) => {
	axios
		.get(
			`https://api.edamam.com/api/recipes/v2?type=public&q=potato&app_key=${process.env.API_KEY}&app_id=${process.env.API_ID}`
		)
		.then(response => {
			console.log(response.data.hits)
			res.render('recipes/list-view', { recipes: response.data.hits })
		})
		.catch(error => console.log(error))
})
module.exports = router
