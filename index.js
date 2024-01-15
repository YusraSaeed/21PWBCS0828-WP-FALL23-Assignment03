const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const authRouter = require('./routes/authRoute');
const productRouter = require('./routes/productRoute');
const salesRouter = require('./routes/salesRoute');
const cartRouter = require('./routes/cartRoute');
const orderRouter = require('./routes/orderRoutes');

const PORT = 4000;
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

const uri = 'mongodb://localhost:27017/ecommerce';
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function() {
    console.log("We're connected to the database.");
});

app.use(cors({
  origin: 'http://localhost:3000' 
}));



app.use('/uploads', express.static('uploads'));
app.use("/api/user", authRouter);
app.use("/api/product", productRouter);
app.use("/api/sales", salesRouter);
app.use("/api/cart", cartRouter);
app.use("/api/orders", orderRouter);

app.listen(PORT, () => {
    console.log(`Server is running at PORT ${PORT} `);
});