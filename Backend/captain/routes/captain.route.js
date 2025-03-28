const captainController = require('../controllers/captain.controller');
const express = require('express');
const router = express.Router();
const { body, query } = require("express-validator")
const authMiddleware = require('../middlewares/captain.middleware');


router.post('/register', [
    body('email').isEmail().withMessage('Invalid Email'),
    body('fullname.firstname').isLength({ min: 3 }).withMessage('First name must be at least 3 characters long'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('vehicle.color').isLength({ min: 3 }).withMessage('Color must be at least 3 characters long'),
    body('vehicle.plate').isLength({ min: 3 }).withMessage('Plate must be at least 3 characters long'),
    body('vehicle.capacity').isInt({ min: 1 }).withMessage('Capacity must be at least 1'),
    body('vehicle.vehicleType').isIn([ 'car', 'moto', 'auto' ]).withMessage('Invalid vehicle type'),
    body('paymentId').isString().withMessage('Invalid payment ID'),
    body('phone').isLength({ min: 10, max: 15 }).withMessage('Invalid Phone Number')
],
    captainController.registerCaptain
)


router.post('/login', [
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
],
    captainController.loginCaptain
)

router.get('/profile', authMiddleware.authCaptain, captainController.getCaptainProfile)

router.get('/logout', authMiddleware.authCaptain, captainController.logoutCaptain)

router.patch('/status', 
    authMiddleware.authCaptain, 
    [
        body('status').isIn(['active', 'inactive', 'Busy']).withMessage('Invalid status')
    ], 
    captainController.changeCaptainStatus
)

router.get('/get-captains-in-radius',
    query('ltd').isNumeric(),
    query('lng').isNumeric(),
    query('radius').isNumeric(),
    captainController.getCaptainsInTheRadius
)

router.post('/confirm',
    authMiddleware.authCaptain,
    body('ride').isObject().withMessage('Invalid ride object'),
    captainController.confirmRide
)

router.get('/get-CaptainById', 
    query('id').isString().withMessage('Invalid captain ID'),
    captainController.getCaptainById
)

router.post('/send-otp', [
    body('phone')
        .trim()
        .isLength({ min: 10, max: 15 })
        .withMessage('Invalid Phone Number')
], captainController.sendOtp);

router.post('/verify-otp', [
    body('otp')
        .trim()
        .isLength({ min: 6, max: 6 })
        .withMessage('Invalid OTP'),
    body('phone')
        .trim()
        .isLength({ min: 10, max: 15 })
        .withMessage('Invalid Phone Number')
], captainController.verifyOtp);

router.post('/resend-otp', [
    body('phone')
        .trim()
        .isLength({ min: 10, max: 15 })
        .withMessage('Invalid Phone Number')
], captainController.resendOtp);


module.exports = router;