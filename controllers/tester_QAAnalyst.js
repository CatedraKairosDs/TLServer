'use strict'

const Profiles = require('../models/profiles')



function getTester_QAAnalysts (req, res) {
    Profiles.find({puesto : 'tester_QAAnalyst'}, (err,tester_QAAnalystProfiles ) => { 
        if (err) return res.status(500).send({message:`Error al realizar getFindAll: ${err}`})
        if(!Profiles) return res.status(404).send({message: `No hay perfiles Back End :${err}`}) 

        res.send(200, {tester_QAAnalystProfiles})
    })
}


module.exports = { getTester_QAAnalysts }