const express = require('express');
const { createTransaction, handleNotification} = require('../controllers/subscriptionController');
const router = express.Router();

router.post('/create', createTransaction);
// router.post('/transaction-success', saveTransactionToFirestore);
router.post('/transaction-notif', handleNotification);
// router.get('/transactions', getTransactionsByEmail);


module.exports = router;
