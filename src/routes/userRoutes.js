const express = require('express');
const { addOrUpdateUser, getUserByUid, getUserSubscriptionsStatusById} = require('../controllers/userController');
const router = express.Router();

router.post('/updatedata', addOrUpdateUser);
router.get('/getuserbyuid/:uid', getUserByUid);
router.get('/subscriptionsstatus/:uid', getUserSubscriptionsStatusById);


module.exports = router;
