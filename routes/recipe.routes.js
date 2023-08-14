const router = require('express').Router()
const Recipe = require('../models/Recipe.model')
const recipesApi = require('../services/recipe.services')

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
	let { error } = req.query
	res.render('recipes/list-view', { cuisineTypes, mealTypes, error })
})

router.post('/list', (req, res, next) => {
	const { food, calories, cuisineType, mealType } = req.body
	const queries = { q: food, calories, cuisineType, mealType }

	//TODO VALIDAR FORM SI TODOS LOS CAMPOS ESTAN VACÍOS

	// if (urlQueries.length === 0) {
	// 	res.render('recipes/list-view', { errorMsg: 'Introduce some filter for the search' })
	// }

	recipesApi
		.getRecipes(queries)
		.then(response =>
			res.render('recipes/list-view', {
				recipes: response.data.hits,
				cuisineTypes,
				mealTypes,
			})
		)
		.catch(err => console.log(err))
})

module.exports = router
