import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import LoginPage from "./components/LoginPage.jsx";
import NotFound from "./components/NotFound.jsx";
import SignupPage from "./components/SignupPage.jsx";
import DashboardPage from "./components/DashboardPage.jsx";
import LandingPage from "./components/LandingPage.jsx";

function App() {
    return (
        <>
            <AuthProvider>
                <div className="App">
                    <BrowserRouter>
                        <Routes>
                            <Route path="/" element={<LandingPage />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/signup" element={<SignupPage />} />
                            <Route path="/dashboard" element={<DashboardPage />} />
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </BrowserRouter>
                </div>
            </AuthProvider>
        </>
    );
}

export default App;
