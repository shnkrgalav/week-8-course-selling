const bcrypt = require("bcrypt");
const { Router} = require("express");
const{userModel, courseModel} = require("../db");
const userRouter = Router();
const jwt = require("jsonwebtoken");
const {JWT_USER_PASSWORD} = require("../config");
const{ userMiddleware } = require("../middleware/user");
 

  

userRouter.post("/signup", async function (req, res){
    try {
        const { email, password, firstName, lastName } = req.body;

        // Hash the password with salt rounds of 4
        const saltRounds = 4;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        await userModel.create({
            email: email,
            password: hashedPassword, // Store the hashed password
            firstName: firstName,
            lastName: lastName
        });

        res.json({
            message: "Signup successful"
        });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({
            message: "An error occurred during signup"
        });
    }
})
 
userRouter.post("/signin", userMiddleware, async function (req, res){
    const {email, password}= req.body;

    const user = await userModel.findOne({
        email: email,
        password: password
    })
    if(user){
        const token = jwt.sign({
            id: user._id
        },JWT_USER_PASSWORD);

        res.json({
            token: token
        })
    } else {
        res.status(403).json({
            message:"Incorrect credentials  "
        })
    }

   
})
userRouter.get("/purchases",userMiddleware,  async function (req, res){
    const userId = req.userId;

    const purchases = await purchaseModel.find({
        userId,
    });

    let purchasedCourseIds = [];

    for (let i = 0; i<purchases.length;i++){ 
        purchasedCourseIds.push(purchases[i].courseId)
    }

    const coursesData = await courseModel.find({
        _id: { $in: purchasedCourseIds }
    })

    res.json({
        purchases,
        coursesData
    })
 
})

module.exports = {
    userRouter: userRouter

}