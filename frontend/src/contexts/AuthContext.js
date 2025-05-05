import React, {createContext, useState, useContext, useEffect} from 'react';
import {authAPI} from '../services/api';

// Create the authentication context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
    return useContext(AuthContext);
};

// Provider component that wraps the app and makes auth object available to any child component that calls useAuth()
export const AuthProvider = ({children}) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Check if user is logged in on initial load
    useEffect(() => {
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');
        if (token) {
            setCurrentUser({token: token, username: username});
        }
        setLoading(false);
    }, []);

    // Register a new user
    const register = async (username, password) => {
        setError('');
        try {
            await authAPI.register(username, password);
            const data = await authAPI.login(username, password);
            setCurrentUser({
                token: data.access_token,
                username: username
            });
            localStorage.setItem('username', username);
            return data;
        } catch (error) {
            setError(error.message);
            throw error;
        }
    };

    // Login a user
    const login = async (username, password) => {
        setError('');
        try {
            const data = await authAPI.login(username, password);
            setCurrentUser({
                token: data.access_token,
                username: username
            });
            localStorage.setItem('username', username);
            return data;
        } catch (error) {
            setError(error.message);
            throw error;
        }
    };

    // Logout a user
    const logout = () => {
        authAPI.logout();
        setCurrentUser(null);
    };

    const value = {
        currentUser,
        login,
        register,
        logout,
        error
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};