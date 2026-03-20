import React, { createContext, useState, useContext } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [medicines, setMedicines] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [waterLog, setWaterLog] = useState(0);

  const loginUser = (userData) => {
    // Stub for Firebase Auth
    setUser(userData);
  };

  const logoutUser = () => {
    setUser(null);
  };

  const trackWater = () => {
    setWaterLog((prev) => prev + 1);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        loginUser,
        logoutUser,
        userLocation,
        setUserLocation,
        medicines,
        setMedicines,
        recipes,
        setRecipes,
        waterLog,
        trackWater,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
