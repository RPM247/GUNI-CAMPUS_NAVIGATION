import { Outlet } from "react-router-dom";
import "./App.css";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import MapComponent from "./components/MapComponent"; 

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Toaster />
      <main>
        <Outlet />
      </main>
      {/* Add the Map Component here */}
      <MapComponent />
    </>
  );
}

export default App;
