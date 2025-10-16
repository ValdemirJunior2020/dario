// src/App.js
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useLocalAuth } from "./auth/useLocalAuth";
import Login from "./components/Login";
import Topbar from "./components/Topbar";
import JobsBoard from "./pages/JobsBoard";
import JobDetail from "./pages/JobDetail";
import Reports from "./pages/Reports";

function Protected({ children }) {
  const { isAuthed } = useLocalAuth();
  if (!isAuthed) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  const { isAuthed, isAdmin, user, login, logout } = useLocalAuth();

  return (
    <BrowserRouter>
      {isAuthed && <Topbar onLogout={logout} user={user} isAdmin={isAdmin} />}
      <Routes>
        <Route path="/login" element={<Login onLogin={login} />} />
        <Route
          path="/"
          element={
            <Protected>
              <JobsBoard isAdmin={isAdmin} user={user} />
            </Protected>
          }
        />
        <Route
          path="/job/:id"
          element={
            <Protected>
              <JobDetail isAdmin={isAdmin} user={user} />
            </Protected>
          }
        />
        <Route
          path="/reports"
          element={
            <Protected>
              <Reports />
            </Protected>
          }
        />
        <Route path="*" element={<Navigate to={isAuthed ? "/" : "/login"} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
