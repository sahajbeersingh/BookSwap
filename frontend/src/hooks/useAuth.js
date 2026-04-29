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
  const [token, setToken] = useState(getStoredToken);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(getStoredToken()));

  useEffect(() => {
    const handleStorage = () => {
      setToken(getStoredToken());
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  useEffect(() => {
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
        if (active) {
          setUser(me || null);
        }
      } catch {
        if (active) {
          setUser(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadUser();

    return () => {
      active = false;
    };
  }, [token]);

  const isAuthenticated = useMemo(() => Boolean(token), [token]);

  return {
    token,
    user,
    isAuthenticated,
    loading,
  };
}
