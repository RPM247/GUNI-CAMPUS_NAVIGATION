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
  const [loading, setLoading] = useState(true)
  const [showCategories, setShowCategories] = useState(false)

  const categories = [
    { name: "Hostels", icon: "🏨", route: "/places/hostel", value: "hostel" },
    { name: "Colleges", icon: "🏫", route: "/places/college", value: "college" },
    { name: "Mess", icon: "🍽", route: "/places/mess", value: "mess" },
    { name: "Sports Complex", icon: "🏀", route: "/places/sports", value: "sports" },
    { name: "Gym", icon: "🏋️", route: "/places/gym", value: "gym" },
    { name: "Hospital", icon: "🏥", route: "/places/hospital", value: "hospital" },
    { name: "Parking", icon: "🅿️", route: "/places/parking", value: "parking" },
    { name: "Canteen", icon: "🍔", route: "/places/canteen", value: "canteen" },
    { name: "Others", icon: "⋮", route: "/places/others", value: "others" },
  ]

  const fetchUserDetails = async () => {
    try {
      const URL = `${import.meta.env.VITE_BACKEND_URL}/api/user-details`
      const response = await axios({ url: URL, withCredentials: true })

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

  if (loading) return null

  return (
    <div className="min-h-screen flex flex-col relative bg-gray-50">
      {/* Add Place Button */}
      <div className="absolute top-6 left-4">
        <button
          onClick={() => navigate("/admin/add-place")}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          ➕ Add New Place
        </button>
      </div>

      {/* View Categories Button */}
      <div className="absolute top-6 left-48">
        <button
          onClick={() => setShowCategories(!showCategories)}
          className="bg-purple-600 text-white px-4 py-2 rounded"
        >
          📂 View Categories
        </button>
      </div>

      {/* Logout Button */}
      <div className="absolute top-4 right-4">
        <button
          title="Logout"
          className="w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded-full bg-white shadow-md"
          onClick={handleLogout}>
          <BiLogOut size={20} />
        </button>
      </div>

      <section className="p-4">
        {showCategories ? (
          <div className="mt-16"> {/* Added margin from the top */}
            <h2 className="text-xl font-bold mb-4">Browse Places by Category</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {categories.map((cat, index) => (
                <div
                  key={index}
                  onClick={() => navigate(cat.route, { state: { category: cat.value } })}
                  className="bg-white shadow-md p-4 rounded-lg flex flex-col items-center cursor-pointer hover:bg-gray-200 transition transform hover:scale-105"
                >
                  <span className="text-3xl">{cat.icon}</span>
                  <p className="mt-2 font-semibold">{cat.name}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <Outlet />
        )}
      </section>
    </div>
  )
}

export default Admin
