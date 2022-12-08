const mongoose = require('mongoose')
const config=require('../helper/config')
const db=mongoose.connect(config.mongoURL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
})

module.exports=db