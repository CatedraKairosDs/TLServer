'use strict'

const express = require('express')

const backEndController = require('../controllers/backEnd')
const bigDataArchitectController = require('../controllers/bigDataArchitect')
const bigDataEngineerController = require('../controllers/bigDataEngineer')
const cloudArchitectController = require('../controllers/cloudArchitect')
const dataArchitectController = require('../controllers/dataArchitect')
const dataScientistController = require('../controllers/dataScientist')
const devOpsEngineerController = require('../controllers/devOpsEngineer')
const entrepriseArchitectController = require('../controllers/entrepriseArchitect')
const frontEndController = require('../controllers/frontEnd')
const iotExpertController = require('../controllers/iotExpert')
const maquetadorController = require('../controllers/maquetador')
const mobileEngineerController = require('../controllers/mobileEngineer')
const profilesController = require('../controllers/profiles')
const qaEngineerController = require('../controllers/qaEngineer')
const softwareArchitectController = require('../controllers/softwareArchitect')
const tester_QAAnalystController = require('../controllers/tester_QAAnalyst')
const uxDesignerController = require('../controllers/uxDesigner')

const router = express.Router()

router.get('/', function(req, res, next) {
    res.render('index');
});

router.get('/api-linkedin/v1/profiles/backEnd', backEndController.getBackEnds)
router.get('/api-linkedin/v1/profiles/bigDataArchitect', bigDataArchitectController.getBigDataAchitects)
router.get('/api-linkedin/v1/profiles/bigDataEngineer', bigDataEngineerController.getBigDataEngineers)
router.get('/api-linkedin/v1/profiles/cloudArchitectEngineer', cloudArchitectController.getCloudArchitects)
router.get('/api-linkedin/v1/profiles/dataArchitect', dataArchitectController.getDataArchitects)
router.get('/api-linkedin/v1/profiles/dataScientist', dataScientistController.getDataScientists)
router.get('/api-linkedin/v1/profiles/devOpsEngineer', devOpsEngineerController.getdevOpsEngineers)
router.get('/api-linkedin/v1/profiles/entrepriseArchitect', entrepriseArchitectController.getEntrepriseArchitects)
router.get('/api-linkedin/v1/profiles/frontEnd', frontEndController.getFrontEnds)
router.get('/api-linkedin/v1/profiles/iotExpert', iotExpertController.getIotExperts)
router.get('/api-linkedin/v1/profiles/maquetador', maquetadorController.getMaquetadores)
router.get('/api-linkedin/v1/profiles/mobileEngineer', mobileEngineerController.getMobileEngineers)
router.get('/api-linkedin/v1/profiles', profilesController.getProfiles)
router.get('/api-linkedin/v1/profiles/qaEngineer', qaEngineerController.getQaEngineers)
router.get('/api-linkedin/v1/profiles/softwareArchitect', softwareArchitectController.getSoftwareArchitect)
router.get('/api-linkedin/v1/profiles/tester_QAAnalyst', tester_QAAnalystController.getTester_QAAnalysts)
router.get('/api-linkedin/v1/profiles/uxDesigner', uxDesignerController.getUxDesigners)


router.get('/api-linkedin/v1/profiles/:Id', profilesController.getById)
router.get('/api-linkedin/v1/profiles', profilesController.getProfiles)

router.post('/api-linkedin/v1/profiles', profilesController.saveProfiles)
router.put('/api-linkedin/v1/profiles/frontEnd/:frontEndId', frontEndController.updateFrontEnd)
router.delete('/api-linkedin/v1/profiles/:Id', profilesController.deleteProfile)


module.exports = router