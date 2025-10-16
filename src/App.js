import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useLocalAuth } from "./auth/useLocalAuth";
import Login from "./components/Login";
import Topbar from "./components/Topbar";
import JobsBoard from "./pages/JobsBoard";

function Protected({ children }) {
  const { isAuthed } = useLocalAuth();
  if (!isAuthed) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  const { isAuthed, login, logout } = useLocalAuth();

  return (
    <BrowserRouter>
      {isAuthed && <Topbar onLogout={logout} />}
      <Routes>
        <Route path="/login" element={<Login onLogin={login} />} />
        <Route
          path="/"
          element={
            <Protected>
              <JobsBoard />
            </Protected>
          }
        />
        <Route path="*" element={<Navigate to={isAuthed ? "/" : "/login"} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
