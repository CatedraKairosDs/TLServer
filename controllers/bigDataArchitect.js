'use strict'

const bigDataArchitect = require('../models/bigDataArchitect')
const Profiles = require('../models/profiles')


function getBigDataAchitects (req, res) {
    Profiles.find({puesto : 'bigDataArchitect'}, (err, BigDataArchitectsProfiles) => { 
        if (err) return res.status(500).send({message:`Error al realizar getFindAll: ${err}`})
        if(!Profiles) return res.status(404).send({message: `No hay perfiles Back End :${err}`}) 

        res.send(200, {BigDataArchitectsProfiles})
    })
}


module.exports = {
    getBigDataAchitects
}