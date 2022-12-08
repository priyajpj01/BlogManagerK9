const express = require('express')
const bodyParser=require('body-parser')
require('../db/mongoose')
require("../models/blogs");
require("../models/user")
const blogRouter=require('../routes/blogs')
const userRouter = require('../routes/user')

const app = express()


// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Header", "*");
  
    next();
  });

app.use(blogRouter)
app.use(userRouter)





module.exports=app