'use strict' 

const express =  require('express')
const bodyParser = require('body-parser')
const app = express()
const route = require('./routes')
const paginate = require('express-paginate')

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  next();
});

app.use(paginate.middleware(10, 50));

app.use(bodyParser.urlencoded({extended: true, limit: '50mb'}))
app.use(bodyParser.json({limit: '50mb'}))
app.use('', route)

app.set('view engine', 'ejs');

module.exports = app
