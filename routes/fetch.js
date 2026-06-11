const express = require('express');
const router = express.Router();
const fetchController = require('../controller/fetch');

router
    .get('/fetchdailyborrower',fetchController.fetchDailyBorrower)
    .get('/fetchdailyborrowerstats',fetchController.fetchDailyBorrowerStats)
    .get('/fetchdailycollectiondetails',fetchController.fetchDailyCollectionDetails)
    .get('/fetchmonthlyborrower',fetchController.fetchMonthlyBorrower)
    .get('/fetchfinanceborrower',fetchController.fetchFinanceBorrower)

module.exports = router;