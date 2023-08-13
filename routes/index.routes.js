const express = require('express')
const router = express.Router()
const axios = require('axios')
require('dotenv').config()

/* GET home page */
router.get('/', (req, res, next) => {
	res.render('index')
})

module.exports = router
