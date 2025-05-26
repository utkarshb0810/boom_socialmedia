import { createContext, useState } from "react";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("boomUser"))
  );
  const [token, setToken] = useState(() => localStorage.getItem("boomToken"));

  const login = (userData, token) => {
    setUser(userData);
    setToken(token);
    localStorage.setItem("boomUser", JSON.stringify(userData));
    localStorage.setItem("boomToken", token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("boomUser");
    localStorage.removeItem("boomToken");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
