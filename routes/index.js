'use strict'

const express = require('express');
const profilesController = require('../controllers/profiles');
const router = express.Router();

router.get('/', function(req, res, next) {
    res.render('index');
});

router.get('/api-linkedin/v1/profiles/id/:id', profilesController.getById);
router.get('/api-linkedin/v1/profiles/idLinkedin/:linkedinid', profilesController.getByLinkedinId);
router.get('/api-linkedin/v1/profiles', profilesController.getProfiles);
router.get('/api-linkedin/v1/profiles/skills', profilesController.getSkills);
router.get('/api-linkedin/v1/profiles/companies', profilesController.getCompanies);
router.get('/api-linkedin/v1/allProfiles', profilesController.getAllProfiles);

router.post('/api-linkedin/v1/profiles', profilesController.saveProfiles);

router.put('/api-linkedin/v1/profiles/:id', profilesController.updateProfile);

router.delete('/api-linkedin/v1/profiles/:id', profilesController.deleteProfile);

module.exports = router;