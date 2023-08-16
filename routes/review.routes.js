const router = require('express').Router()
const Review = require('../models/Review.model')

router.post('/create/:id', (req, res, next) => {
	const { id: recipeID } = req.params
	const { rating, comment } = req.body
	const { _id: user_id } = req.session.currentUser

	const reviewInfo = { rating, comment, recipeID, owner: user_id }

	Review.create(reviewInfo)
		.then(review => res.send(review))
		.catch(err => next(err))
})

module.exports = router
