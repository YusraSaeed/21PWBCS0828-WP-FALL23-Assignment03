const User = require ('./models/users');
const jwt = require ('jsonwebtoken');
const { key } = require('./config/jwtToken'); 



// const authMiddleware = async (req, res, next) => {
//     let token;
//     if(req?.headers?.authorization?.startsWith("Bearer")) {
//         token = req.headers.authorization.split(" ")[1];
//         try {
//             if(token) {
//                 const decoded = jwt.verify(token, key.jwtSecret);
//                 console.log("Decoded user ID:", decoded.id);
//                 const user = await User.findById(decoded?.id);
//                 req.user = user;
//                 next();
//             }
//         } catch (error){
//             res.status(401).json("Token Expired, Login Again");
//         }
//     } else {
//         res.status(401).json("There is no token attached");
//     }
// };
const authMiddleware = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, key.jwtSecret);
            console.log("Decoded token ID:", decoded.id);

            const user = await User.findById(decoded.id).exec();
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            console.log("User found:", user);
            req.user = user;
            next();
        } catch (error) {
            console.error("Error in authMiddleware:", error);
            res.status(401).json("Token expired or invalid");
        }
    } else {
        res.status(401).json("No token provided");
    }
};

const isAdmin = async(req, res, next) => {
    const {email} =  req.user;
    const adminUser = await User.findOne({email});
    if(adminUser.role !== "admin") {
        res.status(401).json("You are not an admin");
    } else {
        next();
    }
};

module.exports = { authMiddleware, isAdmin };
