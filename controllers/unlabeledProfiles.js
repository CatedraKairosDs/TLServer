'use strict'
var crypto = require('crypto');
const UnlabeledProfiles = require('../models/unlabeledProfiles');
var PythonShell = require('python-shell');

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

// Iterar sobre el array de perfiles asincronamente
function saveAllProfiles(unlabeledProfiles, length, searchId) {
    var i = 0;
    return Promise.resolve(i).then(function addNextProfile(i) {
        if (i > length-1) return;
        var unlabeledProfile = unlabeledProfiles[i++];
        return saveUnlabeledProfile(unlabeledProfile, searchId).then(() => addNextProfile(i));
    })
}

// Guardar realmente el perfil
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
        unlabeledProfile.volExps = JSON.stringify(unlabeledProfileParam.volExps)
        unlabeledProfile.orgs = JSON.stringify(unlabeledProfileParam.orgs)
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
        return res.send(200, {allUnlabeledProfiles});
    })
};

//devuelve un perfil dependiendo del parámetro de la query: puesto, label, name
function getUnlabeledProfiles (req, res) {
    
    let params = req.query
    let query = {};
    let p = 1
    let keys = ['searchId', 'name'];
    for(let i = 0; i < keys.length; i++){
        let key = keys[i];

        if (params[key]) {
            query[key] = new RegExp(params[key], 'i');
        }
    }
    try{ 
        
        let result, itemCount; 
        Promise.all([
            UnlabeledProfiles.find(query).sort({_id: -1}).limit(req.query.limit).skip(req.skip).lean().exec(), 
            UnlabeledProfiles.find(query).count({})
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

    } catch(err){
        console.log(err)
    }
}

function deleteAllUnlabeledProfiles(req, res) { 
    var id = req.params.searchId;
    UnlabeledProfiles.find({}).count().then((resp) => {
        if (resp == 0)  {
            return res.send(200, {message:'No hay perfiles'})
        } else {
            UnlabeledProfiles.deleteMany({searchId: id}, (err) => {
                if (err) res.status(500).send({message:`Error en el servidor: ${err}`})
                res.status(200).send({message: 'Los perfiles han sido eliminados'})
            })
        }
    })
}

function predictMlc(req, res) {
    
    //var text = '{ "employees" : [{ "firstName":"John" , "lastName":"Doe" },{ "firstName":"Anna" , "lastName":"Smith" },{ "firstName":"Peter" , "lastName":"Jones" } ]}';
    var classifier = 1
    var profiles = req.body
    
    if (classifier) {
        //var model = require('../resources');
        //Aquí se hace la predicción utilizando el modelo.
        var options = {
            mode: 'text',
            scriptPath: '../resources',
            args: JSON.stringify(profiles)
        };
        var cwd = __dirname;
        console.log(cwd)
        PythonShell.run('mlc.py', options, cwd, function(err, result) {
            if (err) {
                res.status(404).send({message:`Error en el servidor al predecir: ${err}`})
            } else {
                console.log('DESDE NODE => ',result)
                var prediction = result;
                res.status(200).send({
                    data: prediction,
                    message: 'Predicción satisfactoria'
                })
            }
        });
    } else {
        next(new Error('No existe el clasificador'));
    }
} 

function predictDlc(req, res) {
    var classifier = require('resources/MODELO.cpkl')

}

module.exports = {
    saveUnlabeledProfiles,
    getUnlabeledProfiles,
    getAllUnlabeledProfiles,
    deleteAllUnlabeledProfiles,
    predictMlc,
    predictDlc
}
    