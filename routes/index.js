'use strict'

const express = require('express');
const profilesController = require('../controllers/profiles');
const unlabeledProfilesController = require('../controllers/unlabeledProfiles');
const router = express.Router();

router.get('/', function(req, res, next) {
    res.render('index');
});

//profiles
router.get('/api-linkedin/v1/profiles/id/:id', profilesController.getById);
router.get('/api-linkedin/v1/profiles/idLinkedin/:linkedinId', profilesController.getByLinkedinId);
router.get('/api-linkedin/v1/profiles', profilesController.getProfiles);
router.get('/api-linkedin/v1/profiles/skills', profilesController.getSkills);
router.get('/api-linkedin/v1/profiles/companies', profilesController.getCompanies);
router.get('/api-linkedin/v1/allProfiles', profilesController.getAllProfiles);

router.post('/api-linkedin/v1/profiles', profilesController.saveProfiles);

router.put('/api-linkedin/v1/profiles/:id', profilesController.updateProfile);

router.delete('/api-linkedin/v1/profiles/:id', profilesController.deleteProfile);

//unlabeled Profiles
router.get('/api-linkedin/v1/unlabeledProfiles', unlabeledProfilesController.getAllUnlabeledProfiles);

router.post('/api-linkedin/v1/unlabeledProfiles', unlabeledProfilesController.saveUnlabeledProfiles);

router.delete('/api-linkedin/v1/unlabeledProfiles/:searchId', unlabeledProfilesController.deleteAllUnlabeledProfiles);

module.exports = router;
