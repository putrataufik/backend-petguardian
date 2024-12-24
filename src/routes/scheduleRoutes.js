const express = require('express');
const {addScheduleByUid, getScheduleByUid, updateScheduleById} = require('../controllers/scheduleController');
const router = express.Router();

router.post('/addschedule', addScheduleByUid);
router.get('/getschedule/:uid', getScheduleByUid);
router.post('/updateschedule/:scheduleId', updateScheduleById);

module.exports = router;