import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AuthForm from "./components/auth/AuthForm";
import Dashboard from "./components/Dashboard";
import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import ThemeProvider, { useTheme } from "./contexts/ThemeProvider";
import "./index.css";

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <ThemeProvider>
      {loading ? (
        <LoadingScreen />
      ) : (
        <div className="font-sans">
          <Routes>
            <Route
              path="/login"
              element={
                user ? (
                  <Navigate to="/dashboard" />
                ) : (
                  <AuthForm onLogin={setUser} />
                )
              }
            />
            <Route
              path="/dashboard"
              element={
                user ? (
                  <Dashboard user={user} onLogout={handleLogout} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="*"
              element={<Navigate to={user ? "/dashboard" : "/login"} />}
            />
          </Routes>
        </div>
      )}
    </ThemeProvider>
  );
};

const LoadingScreen = () => {
  const { colors } = useTheme();

  return (
    <div
      style={{ backgroundColor: colors.background }}
      className="min-h-screen flex items-center justify-center"
    >
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-800 border-t-transparent"></div>
    </div>
  );
};

export default App;
