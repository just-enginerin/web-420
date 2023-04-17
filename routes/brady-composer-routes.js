/*
============================================
; Title:  brady-composer.js
; Author: Erin Brady
; Date: 7 April 2023
; Description: Routes for WEB 420: RESTful APIs - Composers API
;===========================================
*/

const express = require('express')
const router = express.Router()
const Composer = require('../models/brady-composer')

// Test Router is working
router.get('/', function (req, res, next) {
    console.log("Composer Router Working")
    res.end()
})
 

/**
 * findAllComposers
 * openapi: 3.0.0
 * info:
 *   title: Composer API
 *   description: |-
 *     This is a Composer Server based on the OpenAPI 3.0 specification.
 *   version: 1.0.11
 * tags:
 *   - name: Composers
 * paths:
 *   /composers:
 *     get:
 *       tags:
 *         - Composers
 *       summary: Returns a list of composer documents
 *       description: API for returning a list of composers from MongoDB Atlas.
 *       responses:
 *         '200':
 *           description: Composer documents
 *         '500':
 *           description: Server exception
 *         '501':
 *           description: MongoDB exception
 */
router.get('/composers', async(req, res) => {
    try {
        Composer.find({}, function(mongoError, composers) {
            if (mongoError) {
                console.log(mongoError)
                res.status(501).send({
                    'message': `MongoDB Exception: ${mongoError}`
                })
            } else {
                console.log(composers)
                res.json(composers)
            }
        })
    } catch (serverError) {
        console.log(serverError)
        res.status(500).send({
            'message': `Server Exception: ${serverError.message}`
        })
    }
})

/*
 * findComposerById
 * openapi: 3.0.0
 * info:
 *   title: Composer API
 *   description: |-
 *     This is a Composer Server based on the OpenAPI 3.0 specification.
 *   version: 1.0.11
 * tags:
 *   - name: Composers
 * paths:
 * /composers/{id}:
 *   get:
 *     tags:
 *       - Composers
 *     summary: Returns a composer document
 *     description: API for returning a single Composer object from MongoDB.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The composerId requested by the user.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Composer document in JSON format.
 *       '500':
 *         description: Server exception
 *       '501':
 *         description: MongoDB exception
*/
router.get('/composers/:id', async(req, res) => {
    try {
        Composer.findOne({'_id': req.params.id}, function(mongoError, composer) {
            if (mongoError) {
                console.log(mongoError)
                res.status(501).send({
                    'message': `MongoDB Exception: ${mongoError}`
                })
            } else {
                console.log(composer)
                res.json(composer)
            }
        })
    } catch (serverError) {
        console.log(serverError)
        res.status(500).send({
            'message': `Server Exception: ${serverError.message}`
        })
    }
})

/*
 * createComposer
 * openapi: 3.0.0
 * info:
 *   title: Composer API
 *   description: |-
 *     This is a Composer Server based on the OpenAPI 3.0 specification.
 *   version: 1.0.11
 * tags:
 *   - name: Composers
 * paths:
 *   /composers:
 *   post:
 *     tags:
 *       - Composers
 *     summary: Create a new composer object
 *     description: API for adding new composer objects
 *     requestBody:
 *       description: Composer's information
 *       content:
 *         application/json:
 *           schema:
 *               type: object
 *               properties:
 *                 firstName:
 *                   type: string
 *                   description: The new composer's first name
 *                 lastName:
 *                   type: string
 *                   description: The new composer's last name
 *     responses:
 *       '200':
 *         description: Composer added
 *       '500':
 *         description: Server exception
 *       '501':
 *         description: MongoDB exception
*/
router.post('/composers', async(req, res) => {
    try {
        const newComposer = {
            firstName: req.body.firstName,
            lastName: req.body.lastName
        }

        await Composer.create(newComposer, function(mongoError, composer) {
            if (mongoError) {
                console.log(mongoError)
                res.status(501).send({
                    'message': `MongoDB Exception: ${mongoError}`
                })
            } else {
                console.log(composer)
                res.json(composer)
            }
        })
    } catch (serverError) {
        console.log(serverError)
        res.status(500).send({
            'message': `Server Exception: ${serverError.message}`
        })
    }
})

module.exports = router
