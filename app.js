/*
============================================
; Title:  app.js
; Author: Erin Brady
; Date:   13 March 2023
; Description: Server setup file for WEB 420: RESTful APIs
;===========================================
*/

"use strict"

const express = require("express")
const http = require("http")
const swaggerUi = require("swagger-ui-express")
const swaggerJsDoc = require("swagger-jsdoc")
const mongoose = require("mongoose")
const composerAPI = require('./routes/brady-composer-routes')

const app = express()
app.set('port', process.env.PORT || 3000)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// MongoDB Atlas Connection
const conn = `mongodb+srv://web420_user:WaterHorse30@bellevueuniversity.nhzwaya.mongodb.net/web420DB`
mongoose.connect(conn, {
    promiseLibrary: require('bluebird'),
    useUnifiedTopology: true,
    useNewUrlParser: true
}).then(() => {
    console.log(`Connection to web420DB on MongoDB Atlas successful`)
}).catch(err => {
    console.log(`MongoDB Error: ${err.message}`)
})

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "WEB 420: RESTful APIs",
            version: "1.0.0"
        },
    },
    apis: ['./docs/**/*.yaml', "./routes/*.js"] // files containing annotations for the OpenAPI Specification
}

const openApiSpecification = swaggerJsDoc(options)


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiSpecification))
app.use('/', composerAPI)

http.createServer(app).listen(app.get('port'), () => {
    console.log(`Application started and listening on port ${app.get('port')}`)
})
