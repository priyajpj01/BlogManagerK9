
const app=require('./app.js')
const config=require('../helper/config')
require('dotenv').config()
const port = config.PORT || 3000
app.listen(port, () => {
    console.log('Server is up on port ' + port)
})