const express = require('express');
const Product = require('../models/products'); 
const {isAdmin, authMiddleware} = require('../authMiddleware')
const multer = require('multer');
const path = require('path');
const router = express.Router();

// router.post('/createProduct', authMiddleware, isAdmin, async(req,res) => {
//     try{
//         // if(req.body.title){
//         //     req.body.slug = slugify(req.body.title);
//         // }
//         const newProduct = await Product.create(req.body);
//         res.json(newProduct);
//     } catch {
//         res.json(error);
//     }
// });

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); 
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.post('/createProduct', authMiddleware, isAdmin, upload.single('imageUrls'), async (req, res) => {
    try {
        const productData = {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            stock: req.body.stock,
            imageUrls: [req.file.path], 
        };
        
        const newProduct = await Product.create(productData);
        res.status(201).json(newProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.get('/getaProduct/:id', async(req,res) => {
    const {id} = req.params;
    try{
        const findProduct = await Product.findById(id);
        res.json(findProduct);
    } catch {
        res.json(error);
    }
});

router.get('/products', async (req, res) => {
    try{
        const getProducts = await Product.find();
        res.status(201).json(getProducts);
    } catch {
        //res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.put('/updateProduct/:id', authMiddleware, isAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        const updateProduct = await Product.findOneAndUpdate( { _id: id }, req.body, {
            new: true }
        );
        if(updateProduct) {
          res.status(200).json(updateProduct); // 200 OK status code for successful update
        } else {
          res.status(404).json({ message: 'Product not found' }); // 404 if product not found
        }
    } catch(error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.delete('/deleteProduct/:id', authMiddleware, isAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        const deleteProduct = await Product.findByIdAndDelete(id);
        if(deleteProduct) {
            res.status(200).json({message: 'Product deleted'}); 
        } else {
            res.status(404).json({ message: 'Product not found' }); 
        }
    } catch(error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});



module.exports = router;
