import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useLocalAuth } from "./auth/useLocalAuth";
import Login from "./components/Login";
import Topbar from "./components/Topbar";
import JobsBoard from "./pages/JobsBoard";
import JobDetail from "./pages/JobDetail";
import Reports from "./pages/Reports";

function Protected({ isAuthed, children }) {
  if (!isAuthed) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  const { isAuthed, isAdmin, user, login, logout } = useLocalAuth();

  return (
    <Router>
      {isAuthed && <Topbar onLogout={logout} user={user} isAdmin={isAdmin} />}

      <Routes>
        {/* If already authed, bounce away from /login to home */}
        <Route
          path="/login"
          element={isAuthed ? <Navigate to="/" replace /> : <Login onLogin={login} />}
        />

        <Route
          path="/"
          element={
            <Protected isAuthed={isAuthed}>
              <JobsBoard isAdmin={isAdmin} user={user} />
            </Protected>
          }
        />
        <Route
          path="/job/:id"
          element={
            <Protected isAuthed={isAuthed}>
              <JobDetail isAdmin={isAdmin} user={user} />
            </Protected>
          }
        />
        <Route
          path="/reports"
          element={
            <Protected isAuthed={isAuthed}>
              <Reports />
            </Protected>
          }
        />

        <Route path="*" element={<Navigate to={isAuthed ? "/" : "/login"} replace />} />
      </Routes>
    </Router>
  );
}
