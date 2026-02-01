import { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../utils/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const token = localStorage.getItem('auth_token');

        if (token) {
            try {
                const userData = await authApi.getUser();
                setUser(userData);
                setIsAuthenticated(true);
            } catch (error) {
                localStorage.removeItem('auth_token');
                setUser(null);
                setIsAuthenticated(false);
            }
        }
        setLoading(false);
    };

    const login = async (credentials) => {
        const response = await authApi.login(credentials);
        setUser(response.user);
        setIsAuthenticated(true);
        return response;
    };

    const register = async (userData) => {
        const response = await authApi.register(userData);
        return response;
    };

    const logout = async () => {
        try {
            await authApi.logout();
        } catch(error) {
            console.error('Logout API error:', error);
        } finally {
            localStorage.removeItem('auth_token');
            setUser(null);
            setIsAuthenticated(false);
        }
    };

    return (
        <AuthContext.Provider 
            value={{ 
                user, 
                setUser,
                loading, 
                isAuthenticated, 
                login, 
                register, 
                logout 
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
