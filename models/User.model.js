const { Schema, model } = require('mongoose')

const userSchema = new Schema(
	{
		username: {
			type: String,
			trim: true,
			unique: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
		},
		password: {
			type: String,
			required: true,
		},
		role: {
			type: String,
			enum: ['USER', 'CHEF', 'ADMIN'],
			default: 'USER',
		},
		avatar: {
			type: String,
			default: 'AVATARPORDEFECTO',
		},
		favoritesFromChefs: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Recipe',
			},
		],
		favoritesFromAPI: [
			{
				type: String,
			},
		],
	},
	{
		timestamps: true,
	}
)

const User = model('User', userSchema)

module.exports = User
