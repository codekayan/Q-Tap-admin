import { useEffect } from "react";
import { useColorMode } from "../../context/ThemeModeProvider";


const useRegisterChangeThemeMode = (mode) => {
    const { toggleColorMode, setTheme, mode: ThemeMode } = useColorMode();


    useEffect(() => {
        console.log(mode)
        console.log(ThemeMode)
        // possible values
        /* mode : dark , white  */
        /* ThemeMode : dark , light */
        if ((mode === "white" && ThemeMode !== "light")) {
            setTheme("light")

        } else if (mode === "dark" && ThemeMode !== "dark") {
            setTheme("dark")
        }
    }, [mode])
}

export default useRegisterChangeThemeMode