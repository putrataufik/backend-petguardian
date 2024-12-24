const express = require('express');
const { updateUserByUid, getUserByUid, getUserSubscriptionsStatusById} = require('../controllers/userController');
const router = express.Router();

router.post('/updatedata/:uid', updateUserByUid);
router.get('/getuserbyuid/:uid', getUserByUid);
router.get('/subscriptionsstatus/:uid', getUserSubscriptionsStatusById);


module.exports = router;
