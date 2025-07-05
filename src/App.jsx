import React, { useState, useEffect } from "react";
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
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
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
      <AppContent
        user={user}
        loading={loading}
        onLogin={setUser}
        onLogout={handleLogout}
      />
    </ThemeProvider>
  );
};

const AppContent = ({ user, loading, onLogin, onLogout }) => {
  const { colors } = useTheme();

  if (loading) {
    return (
      <div
        style={{ backgroundColor: colors.background }}
        className="min-h-screen flex items-center justify-center"
      >
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-800 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="font-sans">
      {user ? (
        <Dashboard user={user} onLogout={onLogout} />
      ) : (
        <AuthForm onLogin={onLogin} />
      )}
    </div>
  );
};

export default App;
