import express from 'express';
import 'dotenv/config';

import userRoutes from './Routes/userRoutes.js'
import listingRoutes from './Routes/listingRoutes.js'
import cors from 'cors'
import mongoDbConnection from './mongoDB/connect.js'
import handleFormData from './middleware/multer.js';
import uploadFileToStorage from './firebase/uploadFile.js';

const app = express();
const PORT = process.env.PORT;

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
})

app.use(cors())

// convert json/form data to javascript object and put into request body                 
app.use(express.urlencoded({extended: false}))
app.use(express.json())

app.get("/",(req, res) => res.send("Welcome to our API"));

// app.post("/",handleFormData,uploadFileToStorage)
app.use("/user", userRoutes)
app.use("/listing", listingRoutes)

//launching server on the port number
app.listen(PORT, ()=>{
  console.log(`Server is running at : ${PORT}`);
})