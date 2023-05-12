/*
============================================
; Title:  brady-team-routes.js
; Author: Erin Brady
; Date: 12 April 2023
; Description: Routes for WEB 420: RESTful APIs - Capstone Project: Team API
;===========================================
*/

const express = require('express')
const router = express.Router()
const Team = require('../models/brady-team')

// Test Router is working
router.get('/api', function (req, res, next) {
    console.log("Team Router Working")
    res.end()
})

/**
 * findAllTeams
 * openapi: 3.0.0
 * info:
 *   title: Team API
 *   description: |-
 *     This is a Team Server based on the OpenAPI 3.0 specification.
 *   version: 1.0.11
 * tags:
 *   - name: Teams
 * paths:
 *   /teams:
 *     get:
 *       tags:
 *         - Teams
 *       summary: Returns a list of team documents
 *       description: API for returning a list of teams from MongoDB Atlas.
 *       responses:
 *         '200':
 *           description: Array of Team documents
 *         '500':
 *           description: Server exception
 *         '501':
 *           description: MongoDB exception
 */
router.get('/teams', async(req, res) => {
    try {
        Team.find({}, function(mongoError, teams) {
            if (mongoError) {
                console.log(mongoError)
                res.status(501).send({
                    'message': `MongoDB Exception: ${mongoError}`
                })
            } else {
                console.log(teams)
                res.json(teams)
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
 * assignPlayerToTeam
 * /api/teams/{id}/players:
 *  post:
 *    tags:
 *      - Teams
 *    summary: Assign a new player to a team.
 *    description: API for assigning new player objects to a team.
 *    parameters:
 *      - name: id
 *        in: path
 *        description: The ID of the team in which to assign the new player.
 *        required: true
 *        schema:
 *          type: string
 *    requestBody:
 *      description: Player's information
 *      content:
 *        application/json:
 *          schema:
 *              type: object
 *              properties:
 *                firstName:
 *                  type: string
 *                  description: The new player's first name
 *                lastName:
 *                  type: string
 *                  description: The new player's last name
 *                salary:
 *                  type: number
 *                  description: The new player's salary
 *    responses:
 *      '200':
 *        description: Player document
 *      '401':
 *        description: Invalid teamId
 *      '500':
 *        description: Server exception
 *      '501':
 *        description: MongoDB exception
*/
router.post('/teams/:id/players', async(req, res) => {

    const {
        firstName,
        lastName,
        salary
    } = req.body

    try {
        // Query the teams collection to find the team by their id.
        Team.findOne({'_id': req.params.id}, function(mongoError, team) {
            if (mongoError) {
                console.log(mongoError)
                res.status(501).send({
                    'message': `MongoDB Exception: ${mongoError}`
                })
            } else if(!team) {
                res.status(401).send({
                    'message': `Invalid teamId`
                })
            } else {
                // Create new player
                const newPlayer = {
                    firstName: firstName,
                    lastName: lastName,
                    salary: salary
                }

                // Add the new player to the team's players array
                team.players.push(newPlayer)

                // Save the updated team to MongoDB
                team.save((saveError) => {
                    if(saveError) res.status(500).send({'message': `MongoDB Exception: ${mongoError}`})
                    else res.status(200).send(newPlayer)
                })
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
