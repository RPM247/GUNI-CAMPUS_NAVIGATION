import React, { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { logout, setUser } from '../redux/userSlice'
import { BiLogOut } from 'react-icons/bi'

const Home = () => {
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  console.log('redux user: ', user)

  const fetchUserDetails = async()=>{
    try{
      const URL = `${import.meta.env.VITE_BACKEND_URL}/api/user-details`
      const response = await axios({
        url : URL,
        withCredentials : true
      }) 

      dispatch(setUser(response.data.data))

      if(response.data.logout){
        dispatch(logout())
        navigate("/email")
      }
      console.log("current user details: ", response)
    }catch(error){
      console.log("error", error)
    }
  }

  useEffect(()=>{
    fetchUserDetails()
  }, [])

  const handleLogout = async()=>{
    const URL = `${import.meta.env.VITE_BACKEND_URL}/api/logout`
      const response = await axios({
        url : URL,
        //withCredentials : true
      }) 
    dispatch(logout())
    navigate("/email")
    localStorage.clear()

    
  }

  return (
    <div className="min-h-screen flex flex-col relative">
      home
      <div className="absolute top-4 right-4">
        <button 
          title="Logout" 
          className="w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded-full bg-white shadow-md"
          onClick={handleLogout}>
          <BiLogOut size={20}/>
        </button>
      </div>
      
      <section>
          <Outlet/>
      </section>
    </div>
  )
}

export default Home
