const express = require("express");
const {
  addScheduleByUid,
  getScheduleByUid,
  updateScheduleById,
  deleteScheduleById,
} = require("../controllers/scheduleController");
const router = express.Router();

router.post("/addschedule", addScheduleByUid);
router.get("/getschedule/:uid", getScheduleByUid);
router.post("/updateschedule/:scheduleId", updateScheduleById);
router.delete("/deleteschedule/:scheduleId", deleteScheduleById);

module.exports = router;
