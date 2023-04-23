/*
============================================
; Title:  brady-user.js
; Author: Erin Brady
; Date: 22 April 2023
; Description: Models for WEB 420: RESTful APIs - Users Schema
;===========================================
*/

const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Initialize Composer Schema
const userSchema = new Schema({
    userName: { type: String },
    password: { type: String },
    emailAddress: { type: Array }
});

module.exports = mongoose.model('User', userSchema)
