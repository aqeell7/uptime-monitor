import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Login";
import { Register } from "./pages/Register";

const Dashboard = ()=>{
  return <h1 className="text-2xl font-bold p-5 bg-blue-500 text-white">Dashboard</h1>   
}

function App(){
  return(
    <BrowserRouter>
      <Toaster position="top-right" />

      <Routes>
        <Route path="/" element={<Dashboard/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
      </Routes>
      
    </BrowserRouter>
  )
}

export default App;