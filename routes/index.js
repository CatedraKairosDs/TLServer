//import { prependOnceListener } from 'cluster';

'use strict'

const express = require('express')
const profilesController = require('../controllers/profiles')
const router = express.Router()




router.get('/', function(req, res, next) {
    res.render('index');
});

router.get('/api-linkedin/v1/profiles/:Id', profilesController.getById)
router.get('/api-linkedin/v1/profiles', profilesController.getProfiles)
router.post('/api-linkedin/v1/profiles', profilesController.saveProfiles)
router.get('/api-linkedin/v1/profiles/details/skills', profilesController.getSkills)
router.get('/api-linkedin/v1/profiles/details/companies', profilesController.getCompanies)



module.exports = router