'use strict'

const Profiles = require('../models/profiles')
const Skills = require('../models/skills')
const Companies = require('../models/companies')

//guardado de perfil
function saveProfiles (req, res){

    let profile = new Profiles()

    profile.linkedinId = req.body.linkedinId 
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
    profile.volExps = JSON.stringify(req.body.volExps)
    profile.orgs = JSON.stringify(req.body.orgs)
    profile.beneficCauses = JSON.stringify(req.body.beneficCauses)
    profile.recommendations = JSON.stringify(req.body.recommendations)
    profile.courses = JSON.stringify(req.body.courses)
    profile.publications = JSON.stringify(req.body.publications)
    profile.comment = JSON.stringify(req.body.comment)
    
    profile.save((err, profileStored) => {
        
        if (err) return res.status(500).send({message: `Error en el lado del sevidor: ${err}`})
        res.status(200).send({message: 'Perfil guardado'})
        saveSkill(profile).then(() => {console.log('ya se han guardado todas las skills')});
        saveCompany(profile).then(() => {console.log('ya se han guardado todas las empresas')});
    })

    console.log('MENSAJE GUARDADO')
}

//Esta función sólo se encarga de sacar las skills de cada perfil.
function saveSkill(profile) {
    var skills = JSON.parse(profile.skills);
    var i = 0;
    return Promise.resolve(i).then(function addNextSkill(i) {
        if (i > skills.length -1 ) {
            return;
        } 
        else{
                var skillAux = JSON.stringify(skills[i].skill);
                return searchForSkill(skillAux, i).then((i) => addNextSkill(i));
            }
       
    })
}

//En esta función se busca si existe la skill o no, y si existe, se intenta calcular la clave que le toca.
function searchForSkill(skillAux, i) {
    return new Promise((resolve, reject) => {
        var arraySkillsAux = skillAux.split(" ");
        var j = 0;
        return Promise.resolve(j).then(function checkSkill(j) {
            if (j > (arraySkillsAux.length-1)) {
                i = i+1
                resolve(i);
                return;
            }
            var s = JSON.stringify(arraySkillsAux[j]);
            let sAux = RegExp(arraySkillsAux[j++], 'i')
            return newMethodSkills(sAux, j, arraySkillsAux.length, skillAux).then((j) => checkSkill(j));
        })
    })
}

function newMethodSkills(sAux, j, aLength, skillAux){
    return new Promise((resolve, reject) => {
        Skills.find({skillName: sAux}, (err, skill) => {
            if (err){
                reject(`Error al buscar skill: ${err}`);
                console.log(`Error al buscar skill: ${err}`)
            }
            else if(skill.length !== 0) {
                j = aLength;
                resolve(j);
            }
            else if (((skill.length===0) && (j !== aLength))){
                resolve(j)
            }
            else if((skill.length===0) && (j == (aLength))) {
                saveSkillName(skillAux).then(resolve).catch(reject);
            }

        });
    })
}    

//Aquí se guarda en la base de datos
function saveSkillName(skillAux) {
    return new Promise((resolve, reject) => {           
        let skills = new Skills()
        skills.skillName = skillAux
        skills.save((err, skillStored) => {
            if(err) {
                reject(`Error al guardar skill ${err}`);
                console.log(`Error al guardar skill ${err}`)
            } else {
                resolve(`Se ha guardado la skill ${skillStored}`);
                console.log(`Se ha guardado la skill ${skillStored}`);
            }
        })
    });
}

//Esta función se encarga de sacar las companies de cada perfil
function saveCompany(profile){
    //console.log(`Las empresas del perfil son ${profile.experience}`)
    var companies = JSON.parse(profile.experience)
    var i = 0;
    return Promise.resolve(i).then(function addNextCompany(i) {
        if (i > companies.length -1 ) return;
        var companyAux = JSON.stringify(companies[i++].company);
        return searchForCompany(companyAux).then(() => addNextCompany(i));
    })
}

//En esta función se busca si ya estaba guardada en la base de datos
function searchForCompany(companyAux){

    return new Promise((resolve, reject) => {
        let cAux = RegExp(companyAux, 'i')
        Companies.find({companyName: cAux}, (err, company) => {
            if (err){
                reject(`Error al buscar company: ${err}`);
                console.log(`Error al buscar company: ${err}`)
            }
            else if(company.length !== 0) {
                //console.log(`La company  ${company} ya estaba guardada`)
                resolve(`La company ${company} ya estaba guardada`);
            }
            else if(company.length === 0) {
                saveCompanyName(companyAux).then(resolve).catch(reject);
            }

            })
        });
}

//Aquí se guarda la empresa en la base de datos
function saveCompanyName(companyAux){
    return new Promise((resolve, reject) => {           
        let company = new Companies()
        company.companyName = companyAux
        company.save((err, companyStored) => {
            if(err) {
                reject(`Error al guardar company ${err}`);
                console.log(`Error al guardar company ${err}`)
            } else {
                resolve(`Se ha guardado la company ${companyStored}`);
                console.log(`Se ha guardado la company ${companyStored}`);
            }
        })
    });
}

//Devuelve un perfil por el ID
function getById (req, res) {
    Profiles.findById(req.params.id, (err, profile) => {
        if (err) return res.status(500).send({message:`Error al realizar getById: ${err}`})
        if(!profile) return res.status(404).send({message: `El perfil con id: `+req.params.id+` no existe :${err}`}) 
        res.status(200).send({profile})
    });
}

//Devuelve un perfil por el linkedinID
function getByLinkedinId (req, res) {

    var linkedinId = String(req.params.linkedinId)
    Profiles.find({linkedinId :linkedinId}, (err, profile) => {
        if (err) return res.status(500).send({message:`Error al realizar getById: ${err}`})
        if(!profile) return res.status(404).send({message: `El perfil con id: `+req.params.linkedinId+` no existe :${err}`}) 
        res.status(200).send({profile})
    });
}

//devuelve un perfil dependiendo del parámetro de la query: puesto, label, name
function getProfiles (req, res) {
    
    let params = req.query
    let query = {};
    let p = 1
    let keys = ['puesto', 'label', 'name'];
    for(let i = 0; i < keys.length; i++){
        let key = keys[i];

        if (params[key]) {
            query[key] = new RegExp(params[key], 'i');
        }
    }
    try{ 
        
        let result, itemCount; 
        Promise.all([
            Profiles.find(query).sort({_id: -1}).limit(req.query.limit).skip(req.skip).lean().exec(), 
            Profiles.find(query).count({})
        ]).then(promisses => {
            const [result, itemCount] = promisses;
            if (itemCount == 0) {res.send(404, {message: 'No hay perfiles para esa query'})} 
            else{
             const pageCount = Math.ceil(itemCount / req.query.limit)
             return res.send(200, {
                    data: result,
                    meta:{
                        'totalPages': pageCount
                 }
             })
            }
        })

    }catch(err){
        console.log(err)
    }
}

//Devuelve todos los perfiles
function getAllProfiles(req, res){

    let params = req.query
    let query = {};
    let p = 1
    let keys = ['puesto', 'label', 'name'];
    for(let i = 0; i < keys.length; i++){
        let key = keys[i];

        if (params[key]) {
            query[key] = new RegExp(params[key], 'i');
        }
    }

    Profiles.find(query, (err, allProfiles) => {
        if (allProfiles == 0) {res.send(404, {message: 'No hay perfiles para esa query'})} 
            else {
                if (err) res.status(500).send({message:`Error por parte del servidor al intentar devolver todos los perfiles: ${err}`});
                if (allProfiles.length < 1) res.send(200, {message: 'No hay perfiles guardados en la base de datos'})
                return res.send(200, {allProfiles});
            }   
        })
};

//update un perfil, propiedades label, puesto y comentario
function updateProfile(req, res) {    
    let update = req.body;
    Profiles.findByIdAndUpdate(req.params.id, update, (err, profileUpdated) => {
        if (err) res.status(500).send({message:`Error por parte del servidor al intentar actualizar el perfil: ${err}`});
        res.status(200).send({message: 'El perfil ha sido actualizado'})
    })
};

//borra un perfil por ID 
function deleteProfile (req, res) {
    
    Profiles.findById(req.params.id, (err, profile)  => {
        if (!profile) {
            res.status(404).send({message: `Perfil con id: `+req.params.id+` no existe: ${err}`})
            return;
        } else {
            profile.remove(err => {
                if (err) res.status(500).send({message:`Error por parte del servidor al intentar eliminar el perfil: ${err}`})
                res.status(200).send({message: 'El perfil ha sido eliminado'})
            })
        }
    })
};

function getSkills (req, res) {
    
    Skills.find({}, (err, skills) => { 
        if (err) return res.status(500).send({message:`Error al realizar getSkills: ${err}`})
        if(!Profiles) return res.status(404).send({message: `No hay skills:${err}`}) 
        res.send(200, {skills})
    })
};

function getCompanies (req, res) {

    Companies.find({}, (err, companies) => {
        if (err) return res.status(500).send({message:`Error al realizar getCompanies: ${err}`})
        if(!Profiles) return res.status(404).send({message: `No hay companies:${err}`}) 
        res.send(200, {companies})
    })
};

module.exports = {
    saveProfiles,
    getById,
    getProfiles,
    deleteProfile,
    getSkills,
    getCompanies,
    getByLinkedinId,
    getAllProfiles,
    updateProfile
}
