import React, { createContext, useState, useEffect } from 'react';
import * as authService from '../services/auth.service';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for stored user on mount
        const storedUser = authService.getCurrentUser();
        if (storedUser) {
            setUser(storedUser);
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const data = await authService.login({ email, password });
            setUser(data.user);
            return data;
        } catch (error) {
            console.error("Login Error:", error);
            throw error.response?.data?.message || "Login failed";
        }
    };

    const register = async (name, email, password, role) => {
        try {
            const data = await authService.register({ name, email, password, role });
            setUser(data.user);
            return data;
        } catch (error) {
            console.error("Register Error:", error);
            throw error.response?.data?.message || "Registration failed";
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
