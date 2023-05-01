/*
============================================
; Title:  brady-customer.js
; Author: Erin Brady
; Date: 29 April 2023
; Description: Models for WEB 420: RESTful APIs - Customer Schema
;===========================================
*/

const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Initialize Line Item Schema
const lineItemSchema = new Schema({
    name: { type: String },
    price: { type: Number },
    quantity: { type: Number }
})

// Initialize Invoice Schema
const invoiceSchema = new Schema({
    subtotal: { type: Number },
    tax: { type: Number },
    dateCreated: { type: String },
    dateShipped: { type: String },
    lineItems: { type: Array, schema: lineItemSchema }
})

// Initialize Line Item Schema
const customerSchema = new Schema({
    firstName: { type: String },
    lastName: { type: String },
    username: { type: String },
    invoices: { type: Array, schema: invoiceSchema }
})


module.exports = mongoose.model('Customer', customerSchema)
