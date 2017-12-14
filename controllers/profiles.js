'use strict'

const Profiles = require('../models/profiles')
const Skills = require('../models/skills')



function saveProfiles (req, res){
    
    
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
        console.log('MENSAJE GUARDADO')
    
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

function getProfiles (req, res) {
    
    Profiles.find({}, (err, profiles) => { 
        if (err) return res.status(500).send({message:`Error al realizar getFindAll: ${err}`})
        if(!Profiles) return res.status(404).send({message: `No hay perfiles :${err}`}) 

        res.send(200, {profiles})
    })
}


module.exports = { saveProfiles, getProfiles }
