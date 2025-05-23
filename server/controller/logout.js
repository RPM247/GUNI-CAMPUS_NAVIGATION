async function logout(request, response){

    try{
        //console.log("function is called")
        const cookieOptions = {
            http : true,
            secure : true
        }

        return response.cookie('token', '', cookieOptions).status(200).json({
            message : "Session expired!!!",
            success : true
        })
    }catch(error){
        return response.status(500).json({ 
            message : error.message || error,
            error : true
        })
    }
}

module.exports = logout