/*
============================================
; Title:  brady-person-routes.js
; Author: Erin Brady
; Date: 15 April 2023
; Description: Routes for WEB 420: RESTful APIs - Person's API
;===========================================
*/

const express = require('express')
const router = express.Router()
const Person = require('../models/brady-person')

// Test Router is working
router.get('/api', function (req, res, next) {
    console.log("Person Router Working")
    res.end()
})

/**
 * findAllPersons
 * openapi: 3.0.0
 * info:
 *   title: Person API
 *   description: |-
 *     This is a Person Server based on the OpenAPI 3.0 specification.
 *   version: 1.0.11
 * tags:
 *   - name: Persons
 * paths:
 *   /persons:
 *     get:
 *       tags:
 *         - Persons
 *       summary: Returns a list of person documents
 *       description: API for returning a list of persons from MongoDB Atlas.
 *       responses:
 *         '200':
 *           description: Person documents
 *         '500':
 *           description: Server exception
 *         '501':
 *           description: MongoDB exception
 */
router.get('/persons', async(req, res) => {
    try {
        Person.find({}, function(mongoError, persons) {
            if (mongoError) {
                console.log(mongoError)
                res.status(501).send({
                    'message': `MongoDB Exception: ${mongoError}`
                })
            } else {
                console.log(persons)
                res.json(persons)
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
 * createPerson
 * openapi: 3.0.0
 * info:
 *   title: Person API
 *   description: |-
 *     This is a Person Server based on the OpenAPI 3.0 specification.
 *   version: 1.0.11
 * tags:
 *   - name: Persons
 * paths:
 *   /api/persons:
 *   post:
 *     tags:
 *       - Persons
 *     summary: Create a new Person object
 *     description: API for adding new person objects
 *     requestBody:
 *       description: Person's information
 *       content:
 *         application/json:
 *           schema:
*               type: object
*               properties:
 *                 firstName:
 *                   type: string
 *                   description: The new Person's first name
 *                 lastName:
 *                   type: string
 *                   description: The new Person's last name
 *                 roles: [roleSchema],
 *                 dependents: [dependentSchema],
 *                 birthDate:
 *                   type: string
 *                   description: The new Person's birth date
 *                 
 *     responses:
 *       '200':
 *         description: Person Added Successfully
 *       '500':
 *         description: Server exception
 *       '501':
 *         description: MongoDB exception
*/
router.post('/persons', async(req, res) => {
    try {
        const newPerson = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            roles: req.body.roles,
            dependents: req.body.dependents,
            birthDate: req.body.birthDate
        }

        await Person.create(newPerson, function(mongoError, person) {
            if (mongoError) {
                console.log(mongoError)
                res.status(501).send({
                    'message': `MongoDB Exception: ${mongoError}`
                })
            } else {
                console.log(person)
                res.json(person)
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
