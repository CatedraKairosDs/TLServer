'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SkillsSchema = Schema ({
        skillName: String, 
        skillKey: Number
    })


module.exports = mongoose.model('skills', SkillsSchema)