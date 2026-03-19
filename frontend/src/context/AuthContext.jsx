import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { loginRequest, meRequest } from "@/api/auth";
import { registerUnauthorizedHandler } from "@/api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    registerUnauthorizedHandler(() => {
      localStorage.removeItem("auth_token");
      setUser(null);
      navigate("/login", { replace: true });
    });
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      setIsLoading(false);
      return;
    }

    meRequest()
      .then((currentUser) => setUser(currentUser))
      .catch(() => {
        localStorage.removeItem("auth_token");
        setUser(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  async function login(credentials) {
    const tokenData = await loginRequest(credentials);
    localStorage.setItem("auth_token", tokenData.access_token);
    const currentUser = await meRequest();
    setUser(currentUser);
    toast.success("Zalogowano pomyslnie");
    navigate("/calculators/milling", { replace: true });
  }

  function logout() {
    localStorage.removeItem("auth_token");
    setUser(null);
    navigate("/calculators/milling", { replace: true });
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: Boolean(user),
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth musi byc uzyte wewnatrz AuthProvider");
  }
  return context;
}
