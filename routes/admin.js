const { Router } = require("express");
const adminRouter = Router();
const { adminModel, courseModel} = require("../db")
const jwt = require("jsonwebtoken");
const {JWT_ADMIN_PASSWORD} = require("../config");
const course = require("./course");
const{ adminMiddleware } = require("../middleware/admin");
const z = require("zod"); // Add this import

// Add this schema definition
const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(1),
  lastName: z.string().min(1)
});

adminRouter.post("/signup", async function (req, res) {
  try {
    // Validate the request body
    const { email, password, firstName, lastName } = signupSchema.parse(req.body);

    // ... rest of the signup logic ...
    await adminModel.create({
      email,
      password,
      firstName,
      lastName
    });

    res.json({
      message: "signup successful"
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        message: "Invalid input",
        errors: error.errors
      });
    } else {
      res.status(500).json({
        message: "Internal server error"
      });
    }
  }
});

adminRouter.post("/signin",  async function (req, res){
    const {email, password}= req.body;

    const admin = await adminModel.findOne({
        email: email,
        password: password
    })
    if(admin){
        const token = jwt.sign({
            id: admin._id
        },JWT_ADMIN_PASSWORD);

        res.json({
            token: token
        })
    } else {
        res.status(403).json({
            message:"Incorrect credentials  "
        })
    }
    
})
adminRouter.post("/courses", adminMiddleware, async function (req, res){
    const adminId = req.userId;
     const{title, description, imageUrl, price} = req.body;
     
    const course = await courseModel.create({
        title, description, imageUrl, price, creatorId: adminId

     })

    res.json({
        message:"course created",
        courseId:course._id
    })
})

adminRouter.put("/courses/", async function (req, res){
    const adminId = req.userId;
    const{title, description, imageUrl, price, courseId} = req.body;
    

   const course = await courseModel.update({
      _id:courseId,
      creatorId: adminId
    
   },{
       title:title,
      description:description,
       imageUrl:imageUrl, 
       price:price

    })

   res.json({
       message:"course updated",
       courseId:course._id
   })
})
adminRouter.get("/courses/bulk",adminMiddleware, async function (req, res){

    const adminId = req.userId;
    const course = await courseModel.find({

        creatorId: adminId
      
     });
  
     res.json({
         message:"course updated",
         course
     })
    
})
 
 module.exports = {
    adminRouter: adminRouter
 }
 
 