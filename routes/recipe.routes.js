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
	const ingredientsLines = []
	//TODO VALIDAR FORM O ELIMINAR CAMPOS VACÍOS
	if (typeof food === 'object') {
		food.forEach((elm, idx) => {
			let ingredient = { quantity: quantity[idx], measure: measure[idx], food: elm }
			ingredients.push(ingredient)
			console.log(ingredient)
			console.log(Object.values(ingredient).join(' '))
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
	}
	Recipe.create(recipeInfo)
		.then(recipeCreated => res.send(recipeCreated))
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
	let { error } = req.query
	res.render('recipes/list-view', { cuisineTypes, mealTypes, error })
})

router.post('/list', (req, res, next) => {
	const { food, calories, cuisineType, mealType } = req.body
	const queries = { q: food, calories, cuisineType, mealType }

	if (Object.values(queries).every(val => val === '')) {
		res.render('recipes/list-view', { errorMsg: 'Fullfill at least one field for the search' })
	}

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

router.get('/details/:uri', (req, res, next) => {
	res.send('AAAA')
})

module.exports = router
