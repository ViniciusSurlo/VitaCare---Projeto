// import './App.css'
import Landing from "./pages/Landing"
import Login from "./pages/Login"
import { UsuarioProvider } from "../UsuarioContext";
import { Router, Routes, Route } from "react-router-dom";
function App() {
  return (
    <UsuarioProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={<Landing />} />
        </Routes>

      </Router>
    </UsuarioProvider>
  )
}

export default App
