const express = require("express")
const cors = require("cors")
require('dotenv').config()
const connectDB = require('./config/connectDB')
const router = require('./routes/index')
const cookieParser = require('cookie-parser')

const app =express()
app.use(cors({
    origin : process.env.FRONTEND_URL,
    credentials : true
}))
app.use(express.json())
app.use(cookieParser())


const PORT = process.env.port || 8081

app.get('/', (request, response)=>{
    response.json({
        message : "Server running at " + PORT
    })
})

app.use('/api', router) 

connectDB().then(()=>{
    app.listen(PORT, ()=>{
        console.log("Server running at " + PORT)
    })
})