/*
============================================
; Title:  brady-team.js
; Author: Erin Brady
; Date: 11 April 2023
; Description: Models for WEB 420: RESTful APIs - Capstone Project: Team API
;===========================================
*/

const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Initialize  Schemas

const playerSchema = new Schema({
    firstName: { type: String },
    lastName: { type: String },
    salary: { type: Number }
})

const teamSchema = new Schema({
    name: { type: String },
    mascot: { type: String },
    players: [playerSchema]
})

module.exports = mongoose.model('Team', teamSchema)
