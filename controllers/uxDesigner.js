'use strict'

const Profiles = require('../models/profiles')



function getUxDesigners (req, res) {
    Profiles.find({label : 'uxDesigner'}, (err, uxDesignerProfiles ) => { 
        if (err) return res.status(500).send({message:`Error al realizar getFindAll: ${err}`})
        if(!Profiles) return res.status(404).send({message: `No hay perfiles Back End :${err}`}) 

        res.send(200, { uxDesignerProfiles })
    })
}


module.exports = { getUxDesigners }