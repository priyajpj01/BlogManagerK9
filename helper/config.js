require('dotenv').config()
module.exports = {
    mongoURL: process.env.MONGO_URL,
    secretKey:process.env.JWT_SECRET,
    PORT:process.env.PORT,
    sengridKey:process.env.SENDGRID_API
   
}