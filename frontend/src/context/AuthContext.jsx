import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (token && storedUser) {
        const parsed = JSON.parse(storedUser);
        // Validate that we have a proper user object
        if (parsed && parsed.username) {
          setUser(parsed);
        } else {
          // Invalid data — clear it
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
    } catch (e) {
      // Corrupted localStorage — clear it
      console.error('Failed to parse stored user data, clearing localStorage:', e);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      const data = response.data;
      if (data.requiresOtp) {
        return data; // Return { requiresOtp, username, message }
      }
      
      // Fallback if backend doesn't require OTP (e.g. Admin)
      const token = data.jwtToken;
      const userData = {
        id: data.userId,
        username: data.username,
        roles: data.roles
      };
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return userData;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const verifyLoginOtp = async (username, otpCode) => {
    try {
      const response = await authService.verifyLoginOtp({ username, otpCode });
      const data = response.data;
      
      const token = data.jwtToken;
      const userData = {
        id: data.userId,
        username: data.username,
        roles: data.roles
      };
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return userData;
    } catch (error) {
      console.error('OTP verification failed:', error);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      await authService.registerNormalUser(userData);
      return { requiresOtp: true, username: userData.username };
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const verifyRegisterOtp = async (username, otpCode) => {
    try {
      const response = await authService.verifyRegisterOtp({ username, otpCode });
      const data = response.data;
      
      const token = data.jwtToken;
      const userData = {
        id: data.userId,
        username: data.username,
        roles: data.roles
      };
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return userData;
    } catch (error) {
      console.error('OTP verification failed:', error);
      throw error;
    }
  };

  const registerAdmin = async (userData) => {
    try {
      await authService.registerAdmin(userData);
    } catch (error) {
      console.error('Admin registration failed:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const isAdmin = user?.roles && (
    Array.isArray(user.roles)
      ? user.roles.some(r => r.toUpperCase() === 'ROLE_ADMIN' || r.toUpperCase() === 'ADMIN')
      : typeof user.roles === 'object'
        ? Object.values(user.roles).some(r => r.toUpperCase() === 'ROLE_ADMIN' || r.toUpperCase() === 'ADMIN')
        : false
  );

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#0f1115', color: '#a0a5b1', fontFamily: 'Outfit, sans-serif', fontSize: '1.25rem' }}>
        Loading...
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, verifyLoginOtp, register, verifyRegisterOtp, registerAdmin, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
