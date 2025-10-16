import { useEffect, useState } from "react";
import { AUTH_KEY, USERS } from "./constants";

export function useLocalAuth() {
  const [user, setUser] = useState(null); // { username, role, displayName }

  useEffect(() => {
    try {
      const raw = localStorage.getItem(AUTH_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch (_) {}
  }, []);

  // <-- This is the function App.js passes into <Login onLogin={login} />
  const login = (username, password) => {
    const key = (username || "").trim().toLowerCase();
    const u = USERS[key];
    if (u && password === u.password) {
      const payload = { username: key, role: u.role, displayName: u.displayName };
      localStorage.setItem(AUTH_KEY, JSON.stringify(payload));
      setUser(payload);
      return { ok: true };
    }
    return { ok: false, error: "Invalid username or password" };
  };

  const logout = () => {
    localStorage.removeItem(AUTH_KEY);
    setUser(null);
  };

  return {
    isAuthed: !!user,
    isAdmin: user?.role === "admin",
    user,
    login,
    logout,
  };
}
