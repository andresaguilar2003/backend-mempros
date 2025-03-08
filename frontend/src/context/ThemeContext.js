import React, { createContext, useContext, useState, useEffect } from 'react';
import { Appearance } from 'react-native';
import { DarkTheme, DefaultTheme } from '@react-navigation/native';

// Creamos el contexto del tema
const ThemeContext = createContext();

// Proveedor del tema
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(Appearance.getColorScheme() || 'light');

  // Cambiar el tema entre 'light' y 'dark'
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Guardar el tema cuando cambia
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setTheme(colorScheme);
    });

    return () => subscription.remove();
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, themeStyles: theme === 'dark' ? DarkTheme : DefaultTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook para usar el contexto del tema
export const useTheme = () => useContext(ThemeContext);
