const router = require('express').Router()
const Review = require('../models/Review.model')
const Recipe = require('../models/Recipe.model')
const User = require('../models/User.model')

router.post('/create/:id', (req, res, next) => {
	const { id: recipeID } = req.params
	const { rating, comment } = req.body
	const { _id: owner } = req.session.currentUser

	const reviewInfo = { rating, comment, recipeID, owner }

	const promises = [
		User.findById(owner),
		Recipe.findById(recipeID),
		Review.create(reviewInfo),
		Review.find({ recipeID }).populate('owner'),
	]

	Promise.all(promises)
		.then(([user, recipe, reviews]) => {
			const isFavorite = user.favoritesFromChefs.includes(recipeID)
			res.render('recipes/chef-recipe-details', { recipe, reviews, isFavorite })
		})
		.catch(err => next(err))
})

module.exports = router
