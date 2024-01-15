const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    price: {
        type: Number,
        required: true
    },
    stock: {
    type: Number,
    default : 100,
    select: false
    },
    sold: {
        type: Number,
        default: 0,
        select: false
    },
    //imageUrls: [String],
    created_at: {
        type: Date,
        default: Date.now,
        select: false,
    },
    updated_at: Date
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
