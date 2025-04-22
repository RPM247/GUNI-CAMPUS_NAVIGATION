import React, { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { logout, setUser } from '../redux/userSlice'
import { BiLogOut } from 'react-icons/bi'

const Admin = () => {
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true) // Prevent premature rendering

  const fetchUserDetails = async () => {
    try {
      const URL = `${import.meta.env.VITE_BACKEND_URL}/api/user-details`
      const response = await axios({
        url: URL,
        withCredentials: true
      })

      // If no user or not admin, block access
      if (!response.data.data || !response.data.data.isAdmin) {
        dispatch(logout())
        localStorage.clear()
        navigate("/email")
        return
      }

      dispatch(setUser(response.data.data))
    } catch (error) {
      console.log("error", error)
      dispatch(logout())
      localStorage.clear()
      navigate("/email")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUserDetails()
  }, [])

  const handleLogout = async () => {
    try {
      const URL = `${import.meta.env.VITE_BACKEND_URL}/api/logout`
      await axios({ url: URL, withCredentials: true })
    } catch (err) {
      console.log("Logout error:", err)
    } finally {
      dispatch(logout())
      localStorage.clear()
      navigate("/email")
    }
  }

  if (loading) return null // or a loading spinner

  return (
    <div className="min-h-screen flex flex-col relative">
      admin
      {/* Add Place button - top left */}
      <div className="absolute top-6 left-4">
        <button
          onClick={() => navigate("/admin/add-place")}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          ➕ Add New Place
        </button>
      </div>

      {/* Logout button - top right */}
      <div className="absolute top-4 right-4">
        <button
          title="Logout"
          className="w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded-full bg-white shadow-md"
          onClick={handleLogout}>
          <BiLogOut size={20} />
        </button>
      </div>

      <section>
        <Outlet />
      </section>
    </div>
  )
}

export default Admin
