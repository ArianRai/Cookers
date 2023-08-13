const express = require('express')
const router = express.Router()
const axios = require('axios')
require('dotenv').config()

/* GET home page */
router.get('/', (req, res, next) => {
	res.render('index')
})

router.get('/recipes', (req, res, next) => {
	axios
		.get(
			`https://api.edamam.com/search?q=chicken&app_key=${process.env.API_KEY}&app_id=${process.env.API_ID}`
		)
		.then(response => res.send(response.data.hits))
		.catch(error => console.log(error))
})

module.exports = router
