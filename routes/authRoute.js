const express = require('express');
const User = require('../models/users');
const Order = require('../models/order');
const { generateToken } = require("../config/jwtToken");
const {authMiddleware, isAdmin} = require('../authMiddleware');
const router = express.Router();

router.post('/register', async (req, res) => {
    const { email } = req.body;
    try {
        const findUser = await User.findOne({ email }); 
        if (!findUser) { 
            const newUser = await User.create(req.body);
            res.status(201).json(newUser);
        } else {
            res.status(400).json({
                msg: "User Already Exists",
                success: false,
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
})


// router.post('/login', async (req, res) => {
//     const { email, password } = req.body;
//     try {
//         const findUser = await User.findOne({ email });
//         console.log(findUser);
//         if (findUser && await findUser.isPasswordMatched(password)) {
//             console.log(findUser.isPasswordMatched(password));
//             res.json({
//                 _id: findUser._id, // No need for the optional chaining here
//                 firstName: findUser.firstName,
//                 lastName: findUser.lastName,
//                 email: findUser.email,
//                 mobile: findUser.mobile,
//                 token: generateToken(findUser._id), // Correctly call the function
//             });
//         } else {
//             res.status(400).json({
//                 msg: "Invalid Credentials",
//                 success: false,
//             });
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Server error', error: error.message });
//     } 
// });

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const findUser = await User.findOne({ email });
        if (!findUser) {
            return res.status(400).json({
            msg: "User not found", success: false,
            });
        }     
        const isMatch = await findUser.isPasswordMatched(password);
        if (!isMatch) {
            return res.status(400).json({
                msg: "Invalid Credentials", success: false,
            });
        }
        const token = generateToken(findUser._id);
        res.json({
            _id: findUser._id,
            firstName: findUser.firstName, lastName: findUser.lastName, email: findUser.email,
            mobile: findUser.mobile, token: token,
        }); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.get('/users', async (req, res) => {
    try{
        const getUsers = await User.find();
        res.status(201).json(getUsers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    } 
});

router.get('/getaUser/:id',authMiddleware, isAdmin, async (req, res) => {
    const {id} = req.params;
    try {
        const getaUser = await User.findById(id);
        res.status(200).json(getaUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.put('/updateUser', async (req, res) => {
    const { _id } = req.user;
    try {
    const updatedUser = await User.findByIdAndUpdate(id, { 
        firstName: req?.body.firstName,
        lastName: req?.body.lastNameName,
        phone: req?.body.phone,
        email: req?.body.email,
        password: req?.body.password,
    },
    {
        new: true
    });
    res.json(updatedUser);
    } catch (error) {
    res.status(400).json({ error: error.message });
    }
});

router.get('/orderHistory', authMiddleware, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).populate('orderItems.product', 'name price');
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
  
module.exports = router;