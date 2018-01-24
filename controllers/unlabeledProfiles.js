'use strict'
var crypto = require('crypto');
const UnlabeledProfiles = require('../models/unlabeledProfiles');

//guardado de perfil
function saveUnlabeledProfiles (req, res){
    
    let arrayUnlabeledProfiles = req.body;
    let searchId = String(crypto.createHash('md5').update(JSON.stringify(req.body)).digest('hex'));
    let arrayLength = 0;
    for (var profile in req.body) {
        arrayLength++;
    }
    saveAllProfiles(arrayUnlabeledProfiles, arrayLength, searchId).then(() => {
        res.status(200).send({message: 'Perfiles sin etiquetar guradados'});
    }).catch(() => {
        res.status(500).send({message: 'Error en el servidor al guardar los perfiles sin etiquetar '});
    })

}

function saveAllProfiles(unlabeledProfiles, length, searchId) {
    var i = 0;
    return Promise.resolve(i).then(function addNextProfile(i) {
        if (i > length-1) return;
        var unlabeledProfile = unlabeledProfiles[i++];
        return saveUnlabeledProfile(unlabeledProfile, searchId).then(() => addNextProfile(i));
    })
}

function saveUnlabeledProfile(unlabeledProfileParam, searchId) {
    return new Promise((resolve, reject) => {
        let unlabeledProfile = new UnlabeledProfiles()
        
        unlabeledProfile.name = unlabeledProfileParam.name
        unlabeledProfile.linkedinId = unlabeledProfileParam.linkedinId
        unlabeledProfile.extract = unlabeledProfileParam.extract
        unlabeledProfile.experience = JSON.stringify(unlabeledProfileParam.experience)
        unlabeledProfile.languages = JSON.stringify(unlabeledProfileParam.languages)
        unlabeledProfile.projects = JSON.stringify(unlabeledProfileParam.projects)
        unlabeledProfile.skills = JSON.stringify(unlabeledProfileParam.skills)
        unlabeledProfile.certificates = JSON.stringify(unlabeledProfileParam.certificates)
        unlabeledProfile.awards = JSON.stringify(unlabeledProfileParam.awards)
        unlabeledProfile.voExps = JSON.stringify(unlabeledProfileParam.voExps)
        unlabeledProfile.beneficCauses = JSON.stringify(unlabeledProfileParam.beneficCauses)
        unlabeledProfile.recommendations = JSON.stringify(unlabeledProfileParam.recommendations)
        unlabeledProfile.courses = JSON.stringify(unlabeledProfileParam.courses)
        unlabeledProfile.publications = JSON.stringify(unlabeledProfileParam.publications)
        unlabeledProfile.searchId = searchId  

        unlabeledProfile.save((err, unlabeledProfileStored) => {
            if (err) {
                reject(['Error al guardar el perfil ', unlabeledProfile, err]);
            } else {
                resolve(['Se ha guardado el perfil ', unlabeledProfile]);
            }
        })
    })
}


//Devuelve todos los perfiles
function getAllUnlabeledProfiles(req, res){

    UnlabeledProfiles.find({}, (err, allUnlabeledProfiles) => {
        if (err) res.status(500).send({message:`Error por parte del servidor al intentar devolver todos los perfiles: ${err}`});
        if (allUnlabeledProfiles.length < 1) res.send(200, {message: 'No hay perfiles guardados en la base de datos'})
        return res.send(200, {allUnlabeledProfiles});
    })
};

function deleteAllUnlabeledProfiles(req, res){
    var id = req.params.searchId;
    UnlabeledProfiles.deleteMany({searchId: id}, (err) => {
        if (err) res.status(500).send({message:`Error en el servidor: ${err}`})
        res.status(200).send({message: 'Los perfiles han sido eliminados'})
    })
}
module.exports = {
    saveUnlabeledProfiles,
    getAllUnlabeledProfiles,
    deleteAllUnlabeledProfiles
}
    