const router = require('express').Router()
const Recipe = require('../models/Recipe.model')

const { measureTypes, cuisineTypes, mealTypes } = require('../utils/const-utils')

const axios = require('axios')

router.get('/create', (req, res, next) => {
	res.render('recipes/create-form', { measureTypes, cuisineTypes, mealTypes })
})

router.post('/create', (req, res, next) => {
	const { name, image, food, quantity, measure, cuisineType, mealType } = req.body
	const ingredients = []
	//TODO VALIDAR FORM O ELIMINAR CAMPOS VACÍOS
	if (typeof food === Array) {
		food.forEach((elm, idx) => {
			let ingredient = { food: elm, quantity: quantity[idx], measure: measure[idx] }
			ingredients.push(ingredient)
		})
	} else {
		ingredients.push({ food, quantity, measure })
	}
	const recipeInfo = {
		name,
		image,
		ingredients,
		cuisineType,
		mealType,
	}
	Recipe.create(recipeInfo)
		.then(recipeCreated => res.send(recipeCreated))
		.catch(error => next(error))
})

router.get('/list', (req, res, next) => {
	// 	axios
	// 		.get(
	// 			`https://api.edamam.com/api/recipes/v2?type=public&q=potato&app_key=${process.env.API_KEY}&app_id=${process.env.API_ID}`
	// 		)
	// 		.then(response => {
	// 			console.log(response.data.hits)
	// 			res.render('recipes/list-view', { recipes: response.data.hits })
	// 		})
	// 		.catch(error => console.log(error))

	res.render('recipes/list-view', { cuisineTypes, mealTypes })
})

router.post('/list', (req, res, next) => {
	const { food, calories, cuisineType, mealType } = req.body
	axios
		.get(
			`https://api.edamam.com/api/recipes/v2?type=public&q=${food}&app_id=${process.env.API_ID}&app_key=${process.env.API_KEY}&cuisineType=${cuisineType}&mealType=${mealType}&calories=0-${calories}&random=true`
		)
		.then(response =>
			res.render('recipes/list-view', {
				recipes: response.data.hits,
				cuisineTypes,
				mealTypes,
			})
		)
		.catch(err => next(err))
})

module.exports = router
