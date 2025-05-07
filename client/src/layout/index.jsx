import React from 'react'
import logo from '../assets/guni_logo1.png'

const AuthLayouts = ({children}) => {
  return (
    <>
        <header className='flex justify-center items-center py-5 h-28 shadow-md bg-slate-100'>
            <img
                src={logo}
                alt='logo'
                width={450}
                height={130}
            />
        </header>
        {children}
    </>
  )
}

export default AuthLayouts
