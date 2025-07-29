import { BrowserRouter, Routes, Route } from "react-router-dom";

import PWABadge from "./PWABadge.tsx";
import "./App.css";

import Dashboard from "./pages/Dashboard.tsx";
import SignIn from "./pages/SignIn.tsx";
import SignUp from "./pages/SignUp.tsx";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
      <PWABadge />
    </>
  );
}

export default App;
