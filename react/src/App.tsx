import { BrowserRouter, Routes, Route } from "react-router-dom";

import PWABadge from "./PWABadge.tsx";
import "./App.css";

import Dashboard from "./pages/Dashboard.tsx";
import SignIn from "./pages/SignIn.tsx";
import SignUp from "./pages/SignUp.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import DateDetailScreen from "./pages/date/[date].tsx";
import { CalendarProvider } from "./pages/CalendarContext.tsx";

function App() {
  return (
    <CalendarProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/date/:date"
            element={
              <ProtectedRoute>
                <DateDetailScreen />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </BrowserRouter>
      <PWABadge />
    </CalendarProvider>
  );
}

export default App;
