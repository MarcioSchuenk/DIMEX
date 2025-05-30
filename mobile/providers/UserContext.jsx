import { createContext } from "react";
import { api } from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect, useContext } from "react";


const UserContext = createContext();

export const UserProvider = ({ children }) =>  {
    const [user, setUser] = useState(null);

    const login = async ({login, password}) => {
        try {
            const response = await api.post("/login", {
                login,
                password
            });

            const { accessToken, user } = response.data;

            const userInfo = {
                token: accessToken,
                user,
            }

            await AsyncStorage.setItem('@auth', JSON.stringify(userInfo));
            api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
            setAuthData(userInfo);
        } catch (error) {
            console.error("Login failed:", error);
            throw error;
        }
    };

    const logout = async () => {
        setAuthData(null);
        await AsyncStorage.removeItem('@auth');
        delete api.defaults.headers.common['Authorization'];
    };

    const loadUserFromStorage = async () => {
        const saved = await AsyncStorage.getItem('@auth');
        if (saved) {
            const parsed = JSON.parse(saved);
            setAuthData(parsed);
            api.defaults.headers.common['Authorization'] = `Bearer ${parsed.token}`;
        }
    };

    useEffect(() => {
        loadUserFromStorage();
    }, []);

    return (
        <UserContext.Provider value={{ authData, login, logout}}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser = () => useContext(UserContext);
