import React from 'react'
import {PiUserCircle} from "react-icons/pi"

const Avatar = ({userId, name, imageUrl, width, height}) => {
    let avatarName = ""
    if(name){
        const splitName = name.split(" ")
        if(splitName.length > 1){
            avatarName = splitName[0][0] + splitName[1][0]
        } else {
            avatarName = splitName[0][0]
        }
    }

    const bgColor = [
        "bg-red-500",       
        "bg-orange-500",   
        "bg-yellow-400",    
        "bg-green-500",    
        "bg-green-600",     
        "bg-teal-500",      
        "bg-blue-500",     
        "bg-blue-400",      
        "bg-purple-600",   
        "bg-pink-600",      
        "bg-pink-500",      
        "bg-fuchsia-500",   
        "bg-purple-700",    
        "bg-rose-400",     
        "bg-purple-400",    
        "bg-emerald-500",   
        "bg-yellow-500",    
        "bg-red-700",       
        "bg-gray-400",      
        "bg-slate-700"
    ]
    const randomNumber = Math.floor(Math.random() * 20)
  return (
    <div className={`text-slate-800 overflow-hidden rounded-full font-bold `} style={{width : width+"px", height : height+"px"}}>
        {
            imageUrl ? (
                <img
                    src={imageUrl}
                    width={width}
                    height={height}
                    alt={name}
                    className='overflow-hidden rounded-full'
                />
            ) : (
                name ? (
                    <div style={{width : width+"px", height : height+"px"}} className={`overflow-hidden rounded-full flex justify-center items-center text-lg ${bgColor[randomNumber]}`}>
                        {avatarName}
                    </div>
                ) : (
                    <PiUserCircle size={80}/>
                )
            )
        }
    </div>
  )
}

export default Avatar
