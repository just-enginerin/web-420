/*
============================================
; Title:  brady-customer.js
; Author: Erin Brady
; Date: 29 April 2023
; Description: Routes for WEB 420: RESTful APIs - Customers API
;===========================================
*/

const express = require('express')
const router = express.Router()
const Customer = require('../models/brady-customer')

// Test Router is working
router.get('/', function (req, res, next) {
    console.log("Customer Router Working")
    res.end()
})
 
/*
 * createCustomer
 * openapi: 3.0.0
 * info:
 *   title: Customer API
 *   description: |-
 *     This is a Customer Server based on the OpenAPI 3.0 specification.
 *   version: 1.0.11
 * tags:
 *   - name: Customers
 * paths:
 *   /api/customers:
 *   post:
 *     tags:
 *       - Customers
 *     summary: Create a new customer object
 *     description: API for adding new customer objects
 *     requestBody:
 *       description: Customer's information
 *       content:
 *         application/json:
 *           schema:
 *               type: object
 *               properties:
 *                 firstName:
 *                   type: string
 *                   description: The new customer's first name
 *                 lastName:
 *                   type: string
 *                   description: The new customer's last name
 *     responses:
 *       '200':
 *         description: Customer added
 *       '500':
 *         description: Server exception
 *       '501':
 *         description: MongoDB exception
*/
router.post('/customers', async(req, res) => {
    try {
        const newCustomer = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.username,
            invoices: []
        }

        await Customer.create(newCustomer, function(mongoError, customer) {
            if (mongoError) {
                console.log(mongoError)
                res.status(501).send({
                    'message': `MongoDB Exception: ${mongoError}`
                })
            } else {
                console.log(customer)
                res.json(customer)
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
 * createInvoiceByUserName
 * openapi: 3.0.0
 * info:
 *   title: Customer API
 *   description: |-
 *     This is a Customer Server based on the OpenAPI 3.0 specification.
 *   version: 1.0.11
 * tags:
 *   - name: Customers
 * paths:
 *   /api/customers/{username}/invoices:
 *   post:
 *     tags:
 *       - Customers
 *     summary: Create a new invoice object for a specific customer
 *     description: API for adding new invoice objects
 *     parameters:
 *      - name: username
 *        in: path
 *        description: username of customer creating the invoice.
 *        required: true
 *        schema:
 *          type: string
 *     requestBody:
 *       description: Invoice's information
 *       content:
 *         application/json:
 *           schema:
 *               type: object
 *               properties:
 *                 subtotal:
 *                   type: number
 *                   description: The new invoice's subtotal.
 *                 tax:
 *                   type: number
 *                   description: The new invoice's tax amount.
 *                 dateCreated:
 *                   type: string
 *                   description: The date the new invoice was created.
 *                 dateShipped:
 *                   type: string
 *                   description: The date the invoice was shipped.
 *                 lineItems:
 *                   type: array
 *                   description: A list of line items belonging to the new invoice.
 *     responses:
 *       '200':
 *         description: Customer added
 *       '500':
 *         description: Server exception
 *       '501':
 *         description: MongoDB exception
*/

router.post('/customers/{username}/invoices', async(req, res) => {

    const {
        subtotal,
        tax,
        dateCreated,
        dateShipped,
        lineItems
    } = req.body

    try {
        // Query the customers collection to find the customer by their username.
        Customer.findOne({'username': req.params.username}, function(mongoError, customer) {
            if (mongoError) {
                console.log(mongoError)
                res.status(501).send({
                    'message': `MongoDB Exception: ${mongoError}`
                })
            } else if(!customer) {
                res.status(501).send({
                    'message': `MongoDB Exception: Customer not found`
                })
            } else {
                // Create new invoice
                const newInvoice = {
                    subtotal: subtotal,
                    tax: tax,
                    dateCreated: dateCreated ? dateCreated : new Date(Date.now()),
                    dateShipped: dateShipped,
                    lineItems: lineItems
                }

                // Add the new invoice to the customer's invoices
                customer.invoices.push(newInvoice)

                // Save the updated customer to MongoDB
                customer.save((saveError, savedCustomer) => {
                    if(saveError) res.status(500).send({'message': `MongoDB Exception: ${mongoError}`})
                    else res.status(200).send({'message': 'Customer added to MongoDB'})
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

/*
 * findAllInvoicesByUserName
 * openapi: 3.0.0
 * info:
 *   title: Customer API
 *   description: |-
 *     This is a Customer Server based on the OpenAPI 3.0 specification.
 *   version: 1.0.11
 * tags:
 *   - name: Customers
 * paths:
 * /api/customers/{username}/invoices:
 *   get:
 *     tags:
 *       - Customers
 *     summary: Returns a list of invoices
 *     description: API for returning a list of Invoice objects from MongoDB.
 *     parameters:
 *       - name: username
 *         in: path
 *         description: The username of the Customer in which the list of invoices belongs to.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Customer document in JSON format.
 *       '500':
 *         description: Server exception
 *       '501':
 *         description: MongoDB exception
*/
router.get('/customers/:username/invoices', async(req, res) => {
    try {
        // Query the customers collection to find the customer by username.
        Customer.findOne({'username': req.params.username}, function(mongoError, customer) {
            if (mongoError) {
                console.log(mongoError)
                res.status(500).send({
                    'message': `Server Exception: ${serverError.message}`
                })
            } else if (!customer) {
                res.status(501).send({
                    'message': `MongoDB Exception: Customer not found`
                })
            } else {
                // Return an array of invoices for the specified customer.
                if (customer.invoices.length > 0) res.json(customer.invoices)
                else res.status(501).send({
                    'message': `MongoDB Exception: Customer has no invoices.`
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
