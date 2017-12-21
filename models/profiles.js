'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
//var autoIncrement = require('mongoose-auto-increment')

//var connection = mongoose.connection
//autoIncrement.initialize(connection)

const ProfilesSchema = Schema ({
    
    idLinkedin: String,
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

//ProfilesSchema.plugin(autoIncrement.plugin, 'Profile')
//var Profile = connection.model('Profile', CompanySchema)
module.exports = mongoose.model('profiles', ProfilesSchema)
