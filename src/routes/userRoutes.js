const express = require('express');
const { updateUser, getUserByUid, getUserSubscriptionsStatusById} = require('../controllers/userController');
const router = express.Router();

router.post('/updatedata/:uid', updateUser);
router.get('/getuserbyuid/:uid', getUserByUid);
router.get('/subscriptionsstatus/:uid', getUserSubscriptionsStatusById);


module.exports = router;
