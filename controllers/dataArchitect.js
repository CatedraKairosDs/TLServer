'use strict'

const Profiles = require('../models/profiles')



function getDataArchitects (req, res) {
    Profiles.find({label : 'dataArchitect'}, (err, DataArchitectsProfiles) => { 
        if (err) return res.status(500).send({message:`Error al realizar getFindAll: ${err}`})
        if(!Profiles) return res.status(404).send({message: `No hay perfiles Back End :${err}`}) 

        res.send(200, {DataArchitectsProfiles})
    })
}


module.exports = { getDataArchitects }