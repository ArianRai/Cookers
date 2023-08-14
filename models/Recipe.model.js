const { Schema, model } = require('mongoose')

const recipeSchema = new Schema(
	{
		name: {
			type: String,
			trim: true,
			unique: true,
		},
		image: { type: String },
		ingredientsLines: [String],
		ingredients: [
			{
				food: String,
				quantity: { type: Number },
				measure: {
					type: String,
					enum: [
						'Gram',
						'Kilogram',
						'Pinch',
						'Liter',
						'Quart',
						'Milliliter',
						'Drop',
						'Cup',
						'Tablespoon',
						'Teaspoon',
					],
				},
			},
		],
		cuisineType: {
			type: String,
			enum: [
				'American',
				'Asian',
				'British',
				'Caribbean',
				'Central Europe',
				'Chinese',
				'Eastern Europe',
				'French',
				'Indian',
				'Italian',
				'Japanese',
				'Kosher',
				'Mediterranean',
				'Mexican',
				'Middle Eastern',
				'Nordic',
				'South American',
				'South East Asian',
			],
		},
		mealType: {
			type: String,
			enum: ['Breakfast', 'Dinner', 'Lunch', 'Snack', 'Teatime'],
		},
		totalTime: Number,
		owner: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
	},
	{
		timestamps: true,
	}
)

const Recipe = model('Recipe', recipeSchema)

module.exports = Recipe
