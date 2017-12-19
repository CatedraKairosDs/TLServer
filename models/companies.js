'use strict'

const mongoose = require('mongoose')
var autoIncrement = require('mongoose-auto-increment')
const Schema = mongoose.Schema

var connection = mongoose.connection
autoIncrement.initialize(connection)


const CompanySchema = Schema ({
        companyName: String
    })


CompanySchema.plugin(autoIncrement.plugin, 'Company')
var Company = connection.model('Company', CompanySchema)
module.exports = mongoose.model('Company', CompanySchema)