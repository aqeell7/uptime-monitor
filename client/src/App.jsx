import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Login";
import { Register } from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";

function App(){
  return(
    <BrowserRouter>
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