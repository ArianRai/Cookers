const { Schema, model } = require('mongoose')

const reviewSchema = new Schema(
	{
		rating: {
			type: Number,
		},
		comment: {
			type: String,
		},
		recipeID: {
			type: Schema.Types.ObjectId,
			ref: 'Recipe',
		},
		owner: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
	},
	{
		timestamps: true,
	}
)

const Review = model('Review', reviewSchema)

module.exports = Review
