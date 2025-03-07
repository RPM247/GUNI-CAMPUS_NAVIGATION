const UserModel = require("../models/UserModel")
const bcryptjs = require('bcryptjs')
const nodemailer = require('nodemailer')
const crypto = require('crypto')

async function registerUser(request, response) {
    try{
        const {name, email, profile_pic, password} = request.body
        //console.log(name, email, profile_pic, password)
        const checkEmail = await UserModel.findOne({email})
        if(checkEmail){
            return response.status(400).json({
                message : "Already user exists...!",
                error : true
            }) 
        } 

        const salt = await bcryptjs.genSalt(10)
        const hashpassword = await bcryptjs.hash(password, salt)

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

        const payload = { 
            name,
            email,
            password : hashpassword,
            profile_pic,
            otp,
            otpExpires,
            isVerified : false
        }
        const user = new UserModel(payload)
        const userSave = await user.save()

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false, // Use `true` for port 465, `false` for 587
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        })

        await transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: "Verify Your Email - OTP",
            text: `Your OTP for email verification is: ${otp}. It will expire in 10 minutes. Have fun while exploring our campus...!!! `
        })

        return response.status(201).json({
            message : "OTP sent to email. Verify your email to complete registration.",
            data : userSave,
            success : true,
            email
        })

    }catch (error){
        return response.status(500).json({
            message : error.message || error,
            error : true
        })
    }
}

module.exports = registerUser