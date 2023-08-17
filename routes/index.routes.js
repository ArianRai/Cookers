const express = require('express')
const router = express.Router()
const recipesApi = require('../services/recipe.service')
const { recipeLimit } = require('../consts/recipe-consts')

router.get('/', (req, res, next) => {
	recipesApi
		.getRandom()
		.then(response =>
			res.render('index', { recipes: response.data.hits.slice(0, recipeLimit) })
		)
		.catch(err => next(err))
})

module.exports = router
