// File: microshop-microservices/services/users/routes/authRoutes.js (Đã cập nhật)

const express = require('express');

const { register,
        login,
        getMe, 
        updateDetails,
        updatePassword,
        forgotPassword,
        resetPassword
    } = require('../controllers/authController');


const { 
    getAddresses,
    addAddress,
    updateAddress,
    deleteAddress
} = require('../controllers/addressController');

const { 
    getUserCart,
    updateUserCart
} = require('../controllers/userController');

const { protect } = require('../middleware/authMiddleware');
const passport = require('passport');
const sendTokenResponse = require('../utils/sendTokenResponse');

const router = express.Router();

// Routes cho đăng ký/đăng nhập thông thường
router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);


// Routes cho Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', 
    passport.authenticate('google', { failureRedirect: 'http://localhost:5173/login', session: false }),
    (req, res) => {
        // Sử dụng hàm tiện ích để tạo token và redirect về frontend
        const token = req.user.getJWTToken();
        res.redirect(`http://localhost:5173/auth/callback?token=${token}`);
    }
);
router.put('/updatedetails', protect, updateDetails);
router.put('/updatepassword', protect, updatePassword);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);


// adress
router.route('/addresses')
    .get(protect, getAddresses)
    .post(protect, addAddress);

router.route('/addresses/:addressId')
    .put(protect, updateAddress)
    .delete(protect, deleteAddress);

router.route('/cart')
    .get(protect, getUserCart)
    .put(protect, updateUserCart);
    
module.exports = router;