const UserModel = require('../models/UserModel')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')

async function checkPassword(request, response) {
    try{
        const {password, userId} = request.body
        const user = await UserModel.findById(userId)
        const verifyPassword = await bcryptjs.compare(password, user.password)

        if(!verifyPassword){
            return response.status(400).json({
                message : "Please check password!",
                error : true
            })
        }

        const tokenData = {
            id : user._id,
            email : user.email,
            isAdmin: user.isAdmin
        }
        const token = await jwt.sign(tokenData, process.env.JWT_SECRET_KEY, {expiresIn : '2h'})

        const cookieOptions = {
            httpOnly : true,
            secure : true,
            sameSite : 'None',
        }

        return response.cookie('token', token, cookieOptions).status(200).json({
            message : "Login successfull...!!!",
            token : token,
            success : true,
            user: {
                id: user._id,
                email: user.email,
                isAdmin: user.isAdmin 
            }
        })
    }catch(error){
        return response.status(500).json({
            message : error.message || error,
            error : true
        })
    }
}

module.exports = checkPassword