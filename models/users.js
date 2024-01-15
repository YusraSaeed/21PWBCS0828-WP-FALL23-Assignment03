const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    

    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type :String,
        required: true,
    },
    phone: {
        type :Number,
        required: true,
        unique: true,
    },
    email: {
        type :String,
        required: true,
        unique: true,
    },
    password: {
        type :String,
        required: true,
    },
    role: {
        type: String,
        default: "user",
    },
    cart: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
        quantity: {
            type: Number,
            required: true,
            min: [1, 'Quantity can not be less than 1.'],
            default: 1
        },
        price: {
            type: Number,
            required: true
        }
    }],
});

// userSchema.pre('save', async function(next){
//     this.password = await bcrypt.hash(this.password, 10);
// });

// userSchema.methods.isPasswordMatched = async function(enteredPassword){
//     return await bcrypt.compare(enteredPassword, this.password);
// };

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});
userSchema.methods.isPasswordMatched = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.calculateCartTotal = function() {
    this.cart = this.cart || [];
    this.cartTotal = this.cart.reduce((total, cartItem) => {
      return total + (cartItem.quantity * cartItem.price);
    }, 0);
};
const User = mongoose.model('User', userSchema);

module.exports = User;
