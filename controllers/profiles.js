'use strict'

const Profiles = require('../models/profiles')
const Skills = require('../models/skills')



module.exports.saveProfiles = function saveProfiles (req, res){
    
    
    //console.log(req.body)
     //Creamos un nuevo perfilen la base de datos
    let profile = new Profiles()
    
    profile.puesto = req.body.puesto
    profile.label = req.body.label
    profile.name = req.body.name
    profile.extract = req.body.extract
    profile.experience = JSON.stringify(req.body.experience)
    profile.languages = JSON.stringify(req.body.languages)
    profile.projects = JSON.stringify(req.body.projects)
    profile.skills = JSON.stringify(req.body.skills)
    profile.certificates = JSON.stringify(req.body.certificates)
    profile.awards = JSON.stringify(req.body.awards)
    profile.voExps = JSON.stringify(req.body.voExps)
    profile.beneficCauses = JSON.stringify(req.body.beneficCauses)
    profile.recommendations = JSON.stringify(req.body.recommendations)
    profile.courses = JSON.stringify(req.body.courses)
    profile.publications = JSON.stringify(req.body.publications)
    profile.comment = JSON.stringify(req.body.comment)
    
    profile.save((err, profileStored) => {
        //console.log(`la variable profile es: ${profile}`)

        if (err) return res.status(500).send({message: `Error en el lado del sevidor: ${err}`})
        
        res.status(200).send({perfil: profileStored})
    
    })

    for(var i = 0; i < JSON.parse(profile.skills).length; i++) {
        var skillAux = profile.skills[i].jsonSkill.skill;
        Skills.find({skillName : skillAux}, (err, resp) => {
            if (err) {
                var lastSkill = Skills.find({}).sort({skillKey: -1}).limit(1).toArray();
                if (lastSkill.length === 0) {
                    let skill = new Skills();
                    skill.skillName = skillAux;
                    skill.skillKey = 0;
                    skill.save((err, skillSaved) => {
                        if (err) {
                            console.log('La skill no se ha guardado');
                            return;
                        } else {
                            console.log('Skill guardada');
                        }
                    });
                } else {
                    let skill = new Skills();
                    skill.skillName = skillAux;
                    skill.skillKey = lastSkill[0].skillKey+1;
                    skill.save((err, skillSaved) => {
                        if (err) {
                            console.log('La skill no se ha guardado');
                            return;
                        } else {
                            console.log('Skill guardada');
                        }
                    })
                }
                var lastKey = lastSkill
            } else {
                return;
            }
        })
    }

    //Hay que hacer algo similar a lo de las skills pero con las compañias...


    console.log('MENSAJE GUARDADO')
}

module.exports.getById = function getById (req, res) {
    Profiles.findById(req.params.Id, (err, profile) => {
        if (err) return res.status(500).send({message:`Error al realizar getById: ${err}`})
        if(!profile) return res.status(404).send({message: `El perfil con id: `+req.params.Id+` no existe :${err}`}) 

        res.status(200).send({profile})
    });
}

module.exports.getProfiles = function getProfiles (req, res) {
    let params = req.query
    let query = {};
    let keys = ['puesto', 'label', 'name'];
    for(let i = 0; i < keys.length; i++){
        let key = keys[i];
        if (params[key]) {
            query[key] = params[key]; 
        }
    }
    Profiles.find(query, (err, profiles) => { 
        if (err) return res.status(500).send({message:`Error al realizar getFindAll: ${err}`})
        if(!profiles) return res.status(404).send({message: `No hay perfiles: ${err}`}) 

        res.send(200, {profiles})
    });
}

module.exports.deleteProfile = function deleteProfile (req, res) {
    Profiles.findById(req.params.Id, (err, profile)  => {
        if (!profile) res.status(404).send({message: `Perfil con id: `+req.params.Id+` no existe: ${err}`})
        
        Profiles.remove(err => {
            if (err) res.status(500).send({message:`Error por parte del servidor al intentar eliminar el perfil: ${err}`})
            res.status(200).send({message: 'El perfil ha sido eliminado'})
        })
    })
}



