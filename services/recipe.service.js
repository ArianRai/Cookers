const axios = require('axios')
const { cuisineTypes } = require('../consts/recipe-consts')

class RecipeApiHandler {
	constructor() {
		this.axiosApp = axios.create({
			baseURL: 'https://api.edamam.com/api/recipes/v2',
			params: {
				type: 'public',
				app_key: `${process.env.API_KEY}`,
				app_id: `${process.env.API_ID}`,
				random: true,
			},
		})
	}

	getRecipes(queries) {
		const searchParams = new URLSearchParams()

		for (const [key, value] of Object.entries(queries)) {
			if (value) {
				searchParams.append(key, value)
			}
		}
		return this.axiosApp.get('?' + searchParams.toString())
	}

	getOneRecipe(recipe_id) {
		return this.axiosApp.get(`/${recipe_id}`)
	}

	getRandom() {
		let randomValue = Math.floor(Math.random() * cuisineTypes.length)
		const query = cuisineTypes[randomValue]
		const searchParams = new URLSearchParams()

		searchParams.append('cuisineType', query)
		return this.axiosApp.get('?' + searchParams.toString())
	}
}

const recipesApi = new RecipeApiHandler()

module.exports = recipesApi
