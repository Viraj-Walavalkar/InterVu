// AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('https://plugin-5vmd.onrender.com/getUser',
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
            }
        ); // Replace with your API endpoint
        console.log(response.data)
        setUser(response.data);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const login = async () => {
    try {
        const response = await axios.get('https://plugin-5vmd.onrender.com/getUser',
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
            }
        ); // Replace with your API endpoint // Replace with your login API
      setUser(response.data); // Update user state immediately
    } catch (error) {
      console.error('Login failed', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
