import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { getDesignTokens } from './theme'; // Your custom theme generator
import { useTranslation } from 'react-i18next';
import { GlobalStyles } from '@mui/material';

const ColorModeContext = createContext();

export const useColorMode = () => useContext(ColorModeContext);

export const ThemeModeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
    // Read from localStorage on first render
    const storedMode = localStorage.getItem("themeMode");
    return storedMode === "dark" ? "dark" : "light"; // fallback to light
  });

  useEffect(() => {
    localStorage.setItem("themeMode", mode);
    const root = document.documentElement;
    root.style.setProperty('--mui-bg-color', theme.palette.background.paper);
    root.style.setProperty('--mui-text-color', theme.palette.text.primary);
  }, [mode]);


  const toggleColorMode = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  const setTheme = (theme) => {
    setMode(theme)
  }
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language
  const isArabic = currentLanguage === 'ar';

  const theme = useMemo(() => createTheme(
    {
      ...getDesignTokens(mode),
      typography: {
        fontFamily: isArabic
          ? "'GE SS Two', Tahoma, Arial !important"
          : "Montserrat, sans-serif, Arial, 'GE SS Two',sans-serif !important"
      },
    }
  ), [mode, isArabic]);

  const autofillStyles = {
    WebkitBoxShadow: `0 0 0 1000px ${theme.palette.background.paper} inset`,
    WebkitTextFillColor: `${theme.palette.text.primary} !important`,
    caretColor: theme.palette.text.primary,
    transition: "background-color 9999s ease-in-out 0s",
    borderRadius: 4,
  };

  return (
    <ColorModeContext.Provider value={{ mode, toggleColorMode, setTheme }}>
      <ThemeProvider theme={theme}>
        <GlobalStyles
          styles={{
            "input:-webkit-autofill": autofillStyles,
            "input:-webkit-autofill:hover": autofillStyles,
            "input:-webkit-autofill:focus": autofillStyles,
          }}
        />
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};
