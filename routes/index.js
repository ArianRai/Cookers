module.exports = app => {
	const indexRoutes = require('./index.routes')
	app.use('/', indexRoutes)

	const authRoutes = require('./auth.routes')
	app.use('/auth', authRoutes)

	const recipeRoutes = require('./recipe.routes')
	app.use('/recipe', recipeRoutes)

	const userRoutes = require('./user.routes')
	app.use('/user', userRoutes)

	const reviewRoutes = require('./review.routes')
	app.use('/review', reviewRoutes)
}
