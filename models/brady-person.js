/*
============================================
; Title:  brady-person.js
; Author: Erin Brady
; Date: 15 April 2023
; Description: Models for WEB 420: RESTful APIs - Person's API
;===========================================
*/

const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Initialize  Schemas
const roleSchema = new Schema({
    text: { type: String }
})

const dependentSchema = new Schema({
    firstName: { type: String },
    lastName: { type: String }
})

const personSchema = new Schema({
    firstName: { type: String },
    lastName: { type: String },
    roles: [roleSchema],
    dependents: [dependentSchema],
    birthDate: { type: String }
})


module.exports = mongoose.model('Person', personSchema)
