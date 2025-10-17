"use client";
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useRouter, usePathname } from "next/navigation";
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Configure axios defaults
  axios.defaults.baseURL = backendUrl;
  axios.defaults.withCredentials = true;

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (!loading) {
      // Only redirect if we're sure about the auth state
      if (pathname === "/auth" && user) {
        router.push("/");
      } else if (!user && pathname !== "/auth") {
        router.push("/auth");
      }
    }
  }, [user, loading, pathname]);

  const checkAuth = async () => {
    try {
      const { data } = await axios.get("/auth/me");
      if (data.success) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      const { data } = await axios.post("/auth/login", { username, password });
      if (data.success) {
        setUser(data.user);
        router.push("/");
        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  const logout = async () => {
    try {
      await axios.post("/auth/logout");
      setUser(null);
      router.push("/auth");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
