'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const IotExpertSchema = Schema ({

    puesto: String,
    label: String,
    name: String,
    extract: String,
    experience: String,
    languages: String,
    projects: String,
    skills: String,
    certificates: String,
    awards: String,
    orgs: String,
    voExps: String,
    beneficCauses: String,
    recommendations: String,
    courses: String,
    publications: String,
    comment: String
})


module.exports = mongoose.model('iotExpert', IotExpertSchema)