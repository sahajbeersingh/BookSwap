import { useEffect, useMemo, useState } from "react";
import { authApi } from "../lib/api";

const TOKEN_KEY = "bookswap.accessToken";

const getStoredToken = () => {
  if (typeof window === "undefined") {
    return "";
  }

  return localStorage.getItem(TOKEN_KEY) || "";
};

export default function useAuth() {
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const stored = getStoredToken();
    setToken(stored);
    setInitialized(true);
  }, []);

  useEffect(() => {
    const handleStorage = () => {
      setToken(getStoredToken());
    };

    const handleTokenChange = () => {
      setToken(getStoredToken());
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("auth-token-changed", handleTokenChange);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("auth-token-changed", handleTokenChange);
    };
  }, []);

  useEffect(() => {
    if (!initialized) return;

    let active = true;

    const loadUser = async () => {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const me = await authApi.me();
        if (active) setUser(me || null);
      } catch {
        if (active) setUser(null);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadUser();

    return () => {
      active = false;
    };
  }, [token, initialized]);
  const isAuthenticated = useMemo(() => Boolean(token), [token]);

  return {
    token,
    user,
    isAuthenticated,
    loading,
  };
}
