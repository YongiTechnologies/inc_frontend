"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import api, { setAccessToken } from "@/services/api";
import { useRouter } from "next/navigation";

interface User {
    id: string;
    name: string;
    email: string;
    role: "customer" | "employee" | "admin";
}

interface AuthContextType {
    user: User | null;
    login: (credentials: any) => Promise<void>;
    register: (userData: any) => Promise<void>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const fetchUser = async () => {
        try {
            const { data } = await api.get("/api/auth/me");
            // API might return standard data \{ user: User \} or just \{ id, name, ... \}
            setUser(data.user || data);
        } catch (error) {
            // It's expected to fail if no valid refresh cookie exists. Just stay logged out silently.
            setUser(null);
            setAccessToken(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // Attempt to fetch user profile on load. 
        // If a refresh token cookie is present, the axios interceptor will silently 
        // fetch an access token and this request will succeed, logging the user in.
        fetchUser();
    }, []);

    const login = async (credentials: any) => {
        try {
            setIsLoading(true);
            const { data } = await api.post("/api/auth/login", credentials);
            const token = data.access_token || data.accessToken || data.token;
            
            if (token) {
                setAccessToken(token);
            }
            
            // Now fetch their profile data to populate user state
            await fetchUser();
        } catch (error) {
            console.error("Login failed:", error);
            setIsLoading(false);
            throw error;
        }
    };

    const register = async (userData: any) => {
        try {
            setIsLoading(true);
            await api.post("/api/auth/register", userData);
            
            // Follow immediately by logging in if password is provided
            if (userData.password) {
                await login({
                    email: userData.email,
                    password: userData.password
                });
            } else {
                setIsLoading(false);
            }
        } catch (error) {
            console.error("Registration failed:", error);
            setIsLoading(false);
            throw error;
        }
    };

    const logout = async () => {
        try {
            setIsLoading(true);
            // Hit the logout endpoint to instruct the backend to clear the httpOnly refresh cookie
            await api.post("/api/auth/logout");
        } catch (error) {
            console.error("Logout request failed, proceeding to wipe local state:", error);
        } finally {
            setUser(null);
            setAccessToken(null);
            setIsLoading(false);
            router.push("/");
        }
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            login,
            register,
            logout, 
            isAuthenticated: !!user,
            isLoading 
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
