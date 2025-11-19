// E_com/BE/services/users/routes/internalRoutes.js
const express = require('express');
const { updateUserPoints, findOrCreateUser } = require('../controllers/internalController');

const router = express.Router();
router.post('/update-points', updateUserPoints);
router.post('/find-or-create-user', findOrCreateUser);
module.exports = router;