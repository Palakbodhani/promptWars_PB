import React, { createContext, useState, useContext } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [medicines, setMedicines] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [waterLog, setWaterLog] = useState(0);

  const loginUser = (userData) => setUser(userData);
  const logoutUser = () => setUser(null);
  const trackWater = () => setWaterLog((prev) => Math.min(prev + 1, 8));

  return (
    <AppContext.Provider
      value={{
        user, loginUser, logoutUser,
        userLocation, setUserLocation,
        medicines, setMedicines,
        recipes, setRecipes,
        waterLog, setWaterLog, trackWater,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
