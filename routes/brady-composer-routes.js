/*
============================================
; Title:  brady-composer-routes.js
; Author: Erin Brady
; Date: 7 April 2023
; Description: Routes for WEB 420: RESTful APIs - Composers API
;===========================================
*/

const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
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
 *   /api/composers:
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
 * /api/composers/{id}:
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
 *   /api/composers:
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

/**
 * updateComposerById
 * openapi: 3.0.0
 * info:
 *   title: Composer API
 *   description: |-
 *     This is a Composer Server based on the OpenAPI 3.0 specification.
 *   version: 1.0.11
 * tags:
 *   - name: Composers
 * paths:
 * /api/composers/{id}:
 * put:
 *    tags:
 *      - Composers
 *    summary: Returns an updated composer document
 *    description: API for updating a single Composer document from MongoDB.
 *    parameters:
 *      - name: id
 *        in: path
 *        description: The composerId requested by the user.
 *        required: true
 *        schema:
 *          type: string
 *    requestBody:
 *      description: The updated first and last name of the composer.
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              firstName:
 *                type: string
 *              lastName:
 *                type: string
 *      required: true
 *    responses:
 *      '200':
 *        description: Array of Composer documents
 *      '401':
 *        description: Invalid Composer ID
 *      '500':
 *        description: Server exception
 *      '501':
 *        description: MongoDB exception
*/
router.put('/composers/:id', async(req, res) => {
    try{
        // Find the designated composer by the params ID in MongoDB.
        const composer = await Composer.findById(req.params.id)

        // Check if the composer exists in the database.
        if(composer) {
            // Update the composer.
            composer.set({
                firstName: req.body.firstName,
                lastName: req.body.lastName
            })
            // Save the updated composer.
            const savedComposer = await composer.save()
            // Return updated composer object.
            res.status(200).json(savedComposer)
           
        } else { // If no matching composer was found,
            res.status(501).send({
                'message': 'MongoDB Exception: This composer does not exist in the database.'
            })
        }
    } catch (serverError) {
        res.status(500).send({
            'message': `Server Exception: ${serverError}`
        })
    }
})

/**
 * deleteComposerById
 * openapi: 3.0.0
 * info:
 *   title: Composer API
 *   description: |-
 *     This is a Composer Server based on the OpenAPI 3.0 specification.
 *   version: 1.0.11
 * tags:
 *   - name: Composers
 * paths:
 * /api/composers/{id}:
 *  delete:
 *     tags:
 *       - Composers
 *     summary: Deletes a composer document
 *     description: API for deleting a single Composer object by their ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The composerId to delete.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Composer successfully deleted.
 *       '500':
 *         description: Server exception
 *       '501':
 *         description: MongoDB exception
*/
router.delete('/composers/:id', async(req, res) => {
    try {
        // Find the designated composer by the params ID in MongoDB, and delete it.
        const composer = await Composer.findByIdAndDelete(req.params.id)

        // If the composer was successfully deleted, return the deleted composer document.
        if (composer) {
          res.status(200).json(composer)
        // Otherwise, return the appropriate error.
        } else {
          res.status(401).send({ message: 'Invalid composerId' });
        }
    } catch (serverError) {
        res.status(500).send({ message: `Server exception: ${serverError}` });
    }
})

module.exports = router
