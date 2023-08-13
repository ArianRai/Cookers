const router = require('express').Router()
const Recipe = require('../models/Recipe.model')

const axios = require('axios')

router.get('/create', (req, res, next) => {
	const measureTypes = [
		'Ounce',
		'Gram',
		'Pound',
		'Kilogram',
		'Pinch',
		'Liter',
		'Fluid ounce',
		'Gallon',
		'Pint',
		'Quart',
		'Milliliter',
		'Drop',
		'Cup',
		'Tablespoon',
		'Teaspoon',
	]

	res.render('recipes/create-form', { measureTypes })
})

router.post('/create', (req, res, next) => {
	res.send(req.body)
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
