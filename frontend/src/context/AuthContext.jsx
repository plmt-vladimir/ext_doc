import { createContext, useContext, useEffect, useState } from "react";
import api from "@/api/axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // При монтировании — загружаем пользователя из localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Авторизация
  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", new URLSearchParams({
        username: email,
        password: password,
      }), {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      const data = response.data;
      const token = data.access_token;

      // Примерно как получить профиль
      const profileRes = await api.get("/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const userData = profileRes.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      navigate("/");
    } catch (err) {
      throw new Error("Неверный логин или пароль");
    }
  };

  // Выход
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/autorisation");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
