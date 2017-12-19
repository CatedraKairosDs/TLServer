'use strict'

const mongoose = require('mongoose')
var autoIncrement = require('mongoose-auto-increment')
const Schema = mongoose.Schema

var connection = mongoose.connection
autoIncrement.initialize(connection)

const SkillsSchema = Schema ({
        skillName: String
    })

SkillsSchema.plugin(autoIncrement.plugin, 'Skill')
var Skill = connection.model('Skill', SkillsSchema)


module.exports = mongoose.model('Skill', SkillsSchema)