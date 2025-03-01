import { Outlet } from 'react-router-dom';
import './App.css'
import { useState } from 'react';
import toast, {Toaster} from 'react-hot-toast'

function App() {
  const [count, setcount] = useState(0)
  return (
    <>
      <Toaster/>
      <main>
        <Outlet/>
      </main>
    </>
  ); 
}

export default App
