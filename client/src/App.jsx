import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Login";
import { Register } from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

const Dashboard = () => (
  <div className="p-10">
      <h1 className="text-3xl font-bold">Welcome to the Dashboard!</h1>
      <p>This page is only visible to logged-in users.</p>
  </div>
);

function App(){
  return(
    <BrowserRouter>
      <Navbar/>
      <Toaster position="top-right" />

      <Routes>
        <Route path="/" element={<ProtectedRoute>
          <Dashboard/>
        </ProtectedRoute>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
      </Routes>
      
    </BrowserRouter>
  )
}

export default App;