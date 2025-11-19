// admin routes for manage user
const express = require('express');
const { getUsers, updateUser, deleteUser } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

//use middleware for all route below, has user and user must role is ADMIN
router.use(protect);
router.use(authorize('ADMIN'));

router.route('/').get(getUsers);

router.route('/:id')
    .put(updateUser)
    .delete(deleteUser);

module.exports = router;