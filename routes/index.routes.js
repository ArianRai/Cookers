const express = require('express')
const router = express.Router()
const recipesApi = require('../services/recipe.service')
require('dotenv').config()

/* GET home page */
router.get('/', (req, res, next) => {
	let limit = 5
	recipesApi
		.getRandom()
		.then(response => res.render('index', { recipes: response.data.hits.slice(0, limit) }))
		.catch(err => next(err))
})

module.exports = router
