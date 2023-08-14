const axios = require('axios')

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

	getAllCharacters() {
		return this.axiosApp.get('/characters')
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
}

const recipesApi = new RecipeApiHandler()

module.exports = recipesApi
