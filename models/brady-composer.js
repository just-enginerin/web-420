/*
============================================
; Title:  brady-composer.js
; Author: Erin Brady
; Date: 7 April 2023
; Description: Models for WEB 420: RESTful APIs - Composers API
;===========================================
*/

const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Initialize Composer Schema
const composerSchema = new Schema({
    firstName: { type: String },
    lastName: { type: String }
});

module.exports = mongoose.model('Composer', composerSchema)
