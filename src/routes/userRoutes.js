const express = require("express");
const {
  updateUserByUid,
  getUserByUid,
  getUserSubscriptionsStatusById,
  updateUsageTokenByUid,
  getUsageTokenByUid,
  uploadMiddleware,
} = require("../controllers/userController");
const router = express.Router();

router.post("/updatedata/:uid",uploadMiddleware, updateUserByUid);
router.post("/updatedatatoken/:uid", updateUsageTokenByUid);
router.get("/getuserbyuid/:uid", getUserByUid);
router.get("/getusagetoken/:uid", getUsageTokenByUid);
router.get("/subscriptionsstatus/:uid", getUserSubscriptionsStatusById);

module.exports = router;
