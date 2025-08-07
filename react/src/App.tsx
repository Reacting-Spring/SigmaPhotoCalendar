import { BrowserRouter, Routes, Route } from "react-router-dom";

import PWABadge from "./PWABadge.tsx";
import { PWAInstallPrompt } from "./components/PWAInstallPrompt.tsx";
import { ToastManager } from "./components/Toast.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import SignIn from "./pages/SignIn.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import DateDetailScreen from "./pages/date/[date].tsx";
import { CalendarProvider } from "@/context/calendar-context";
import { ConfirmDialogManager } from "./components/ConfirmDialog.tsx";

function App() {
  return (
    <ToastManager>
      <ConfirmDialogManager>
        <BrowserRouter>
          <CalendarProvider>
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
            </Routes>
          </CalendarProvider>
        </BrowserRouter>
        <PWABadge />
        <PWAInstallPrompt />
      </ConfirmDialogManager>
    </ToastManager>
  );
}

export default App;
