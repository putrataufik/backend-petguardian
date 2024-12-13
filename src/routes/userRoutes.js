const express = require('express');
const { addOrUpdateUser, getUserByUid} = require('../controllers/userController');
const router = express.Router();

router.get('/getuserbyuid/:uid', getUserByUid);
router.post('/updatedata', addOrUpdateUser);


module.exports = router;
