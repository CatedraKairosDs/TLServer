'use strict'

const Profiles = require('../models/profiles')



function getdevOpsEngineers (req, res) {
    Profiles.find({puesto : 'devOpsEngineer'}, (err, DevOpsEngineersProfiles) => { 
        if (err) return res.status(500).send({message:`Error al realizar getFindAll: ${err}`})
        if(!Profiles) return res.status(404).send({message: `No hay perfiles Back End :${err}`}) 

        res.send(200, {DevOpsEngineersProfiles})
    })
}


module.exports = { getdevOpsEngineers }