import React, { createContext, useState, useContext } from "react";

// Create the Context
const AppContext = createContext();

// Create the Provider component
export const AppProvider = ({ children }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to handle login (for demonstration, this is just a mock)
  const loginUser = async (email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulating a login API call
      setTimeout(() => {
        if (email === "user@example.com" && password === "password") {
          setIsLoading(false);
          return { success: true };
        } else {
          setIsLoading(false);
          setError("Invalid credentials");
          return { success: false };
        }
      }, 2000);
    } catch (err) {
      setIsLoading(false);
      setError("An error occurred");
      return { success: false };
    }
  };

  return (
    <AppContext.Provider
      value={{
        email,
        setEmail,
        password,
        setPassword,
        isLoading,
        error,
        loginUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useAppContext = () => {
  return useContext(AppContext);
};
