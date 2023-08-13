require('dotenv').config()

require('./db')

const express = require('express')

const hbs = require('hbs')

const app = express()

require('./config')(app)

app.locals.appTitle = `Pruebotas`

const indexRoutes = require('./routes/index.routes')
app.use('/', indexRoutes)

const authRoutes = require('./routes/auth.routes')
app.use('/user', authRoutes)

require('./error-handling')(app)

module.exports = app
