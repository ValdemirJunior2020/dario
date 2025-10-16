import { useEffect, useState } from "react";
import { AUTH_KEY, HARDCODED_USER } from "./constants";

export function useLocalAuth() {
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    setIsAuthed(localStorage.getItem(AUTH_KEY) === "ok");
  }, []);

  const login = (username, password) => {
    if (
      username.trim().toLowerCase() === HARDCODED_USER.username &&
      password === HARDCODED_USER.password
    ) {
      localStorage.setItem(AUTH_KEY, "ok");
      setIsAuthed(true);
      return { ok: true };
    }
    return { ok: false, error: "Invalid username or password" };
  };

  const logout = () => {
    localStorage.removeItem(AUTH_KEY);
    setIsAuthed(false);
  };

  return { isAuthed, login, logout };
}
