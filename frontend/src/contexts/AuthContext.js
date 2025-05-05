import React, {createContext, useState, useContext, useEffect} from 'react';
import {authAPI} from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({children}) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');
        if (token) {
            setCurrentUser({token: token, username: username});
        }
        setLoading(false);
    }, []);

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