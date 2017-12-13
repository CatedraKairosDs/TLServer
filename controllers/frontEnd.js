'use strict'

const FrontEnd = require('../models/frontEnd')
const Profiles = require('../models/profiles')


function getFrontEnd (req, res) {
    let frontEndId = req.params.frontEndId
    console.log(`${frontEndId}`)
    
    FrontEnd.findById(frontEndId, (err, FrontEnd) => {
        if (err) return res.status(500).send({message:`Error al realizar getById: ${err}`})
        if(!FrontEnd) return res.status(404).send({message: `El perfil Front End no existe :${err}`}) 

        res.status(200).send({perfilFrontEnd: FrontEnd})

    })
} 

function getFrontEnds(req, res) {
    Profiles.find({puesto: 'frontEnd'} , (err, FrontEndProfiles) => { 
        if (err) return res.status(500).send({message:`Error al realizar getFindAll: ${err}`})
        if(!FrontEnd) return res.status(404).send({message: `No hay perfiles Front End :${err}`}) 

        res.send(200, {FrontEndProfiles})
    })
}


function updateFrontEnd(req, res) {
    let frontEndId = req.params.frontEndId
    let update = req.body

    FrontEnd.findByIdAndUpdate(frontEndId, update, (err, pFrontEndUpdated) => {
        if(err) res.status(500).send({message: `Error al intentar actualizar un perfil Front End: ${err}`})
        
        res.status(200).send({perfilFrontEnd: pFrontEndUpdated})
    })

}

function deleteFrontEnd(req, res) {
    let frontEndId = req.params.frontEndId
    //console.log(`${frontEndId}`)
        FrontEnd.findById(frontEndId, (err, pFrontEnd) => {
            //if (err) res.status(500).send({message: `Perfil Front End no existe: ${err}`})
            if (!pFrontEnd) res.status(500).send({message: `Perfil Front End no existe: ${err}`})
            
            pFrontEnd.remove(err => {
                if (err) res.status(500).send({message:`Error por parte del servidor al intentar eliminar un perfil de Fron End: ${err}`})
                res.status(200).send({message: 'El perfil Front End ha sido eliminado'})
            })
        })

}


module.exports = {
    getFrontEnd,
    getFrontEnds,
    updateFrontEnd,
    deleteFrontEnd
}