/*
============================================
; Title:  brady-session-routes.js
; Author: Erin Brady
; Date: 22 April 2023
; Description: Routes for WEB 420: RESTful APIs - Session API
;===========================================
*/

const express = require('express')
const router = express.Router()
const User = require('../models/brady-user')
const bcrypt = require('bcryptjs')

let saltRounds = 10

/**
openapi: 3.0.0
info:
  title: Session API
  description: |-
    This is a User Session Server based on the OpenAPI 3.0 specification.
  version: 1.0.11
tags:
  - name: Sessions
paths:
  /api/signup:
    post:
      tags:
        - Users
      summary: Registers a new user
      description: API for registering a new user.
      requestBody:
        description: User's registration information
        content:
          application/json:
            schema:
              type: object
              properties:
                username:
                  type: string
                  description: The username requested by the new user.
                password:
                  type: string
                  description: The password requested by the new user.
                emailAddress:
                  type: string
                  description: The email address of the new user.
      responses:
        '200':
          description: Registered user.
        '401':
          description: Username is already in use.
        '500':
          description: Server exception.
        '501':
          description: MongoDB exception.

*/
router.post('/signup', async(req, res) => {
    try {
        // Search the Users collection to determine whether the user is already registered.
        User.findOne({'username': req.body.username}, function(mongoError, user) {
            if (mongoError) {
                console.log(mongoError)
                res.status(501).send({
                    'message': `MongoDB Exception: ${mongoError}`
                })
            // If the user is already registered, return an error.
            } else if (user) {
                res.status(401).send({
                    'message': 'Username is already in use.'
                })
            } else {
                // If the user is not already registered, encrypt their password before registering them in the Users collection.
                let hashedPassword = bcrypt.hashSync(req.body.password, saltRounds)
                let newRegisteredUser = {
                    username: req.body.username,
                    password: hashedPassword,
                    emailAddress: req.body.emailAddress
                }
                User.create(newRegisteredUser)
                res.status(200).send({
                    'message': 'Registered user.'
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

/**
openapi: 3.0.0
info:
  title: Session API
  description: |-
    This is a User Session Server based on the OpenAPI 3.0 specification.
  version: 1.0.11
tags:
  - name: Sessions
paths:
  /api/login:
    post:
      tags:
        - Users
      summary: Logs in a user
      description: API for logging in a user.
      requestBody:
        description: User's login information
        content:
          application/json:
            schema:
              type: object
              properties:
                username:
                  type: string
                  description: The username requested by the new user.
                password:
                  type: string
                  description: The password requested by the new user.
      responses:
        '200':
          description: User logged in.
        '401':
          description: Invalid username and/or password.
        '500':
          description: Server exception.
        '501':
          description: MongoDB exception.

*/
router.post('/login', async(req, res) => {
    try {
        // Search the users collection to determine whether the user is already registered.
        User.findOne({'username': req.body.username}, function(mongoError, user) {
            if (mongoError) {
                console.log(mongoError)
                res.status(501).send({
                    'message': `MongoDB Exception: ${mongoError}`
                })
            // If the user is already registered, decrypt their password to ensure they entered the correct credentials.
            } else if (user) {
                let passwordIsValid = bcrypt.compareSync(req.body.password, user.password)
                if (passwordIsValid) {
                    res.status(200).send({
                        'message': 'User logged in.'
                    })
                } else {
                    res.status(401).send({
                        'message': 'Invalid password.'
                    })
                }
            } else {
                res.status(401).send({
                    'message': 'Invalid username.'
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
