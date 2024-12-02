const express = require("express");
const mongoose = require("mongoose");


const { userRouter } = require("./routes/user");
const { courseRouter } = require("./routes/course");
const { adminRouter } = require("./routes/admin");

const app = express();

//app.use()
app.use(express.json());

 
 app.use("/api/v1/user", userRouter);
 app.use("/api/v1/course", courseRouter);
 app.use("/api/v1/admin",  adminRouter);


 async function main(){
      
    await mongoose.connect("mongodb+srv://shnkxr1:Ic2lrrfg19VE2HTE@cluster0.fiv1h.mongodb.net/courseselling-app")
    app.listen(3000);

 }

 main()