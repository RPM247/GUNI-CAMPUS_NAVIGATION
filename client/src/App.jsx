import { Outlet } from 'react-router-dom';
import './App.css'
import { useState } from 'react';

function App() {
  const [count, setcount] = useState(0)
  return (
    <main>
      <Outlet/>
    </main>
  ); 
}

export default App
