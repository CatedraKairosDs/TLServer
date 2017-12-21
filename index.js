'use strict'
const mongoose = require('mongoose') 
const app = require('./app')
mongoose.Promise = require('bluebird')

//port puede ser una variable de entorno o en su defecto coge el valor de 3000
const port = 3001

var fs = require('fs');
var http = require('https')
var https = require('https')

//funcion de callback para conectarnos a la base de datos.
mongoose.connect('mongodb://localhost:27017/perfiles', (err, res) => {
    if (err) {
        return console.log(`Error al conectarse a la base de datos: ${err}`)
    }
    console.log(`Conexion a la base de datos establecida`)
    
    var credentials = {
        key: fs.readFileSync('key.pem'),
        cert: fs.readFileSync('cert.pem'),
        passphrase: 'roberto'
      }
    

    var httpsServer = https.createServer(credentials, app)
    
    httpsServer.listen(port, () => {
        console.log(`API REST corriendo en http://localhost:${port}`)
    })
})
