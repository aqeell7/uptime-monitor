import { createContext, useState, useEffect } from 'react';
import api from '../api/axios.js';
import { toast } from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user')
    if (token && storedUser) {
      setUser(JSON.parse(storedUser))
    }

    setLoading(false);
   }, []);

  const loginUser = async (email, password) => {
    try {
      const res = await api.post('/users/auth', { email, password });

      const data = res.data;

      localStorage.setItem('token', data.token);
      localStorage.setItem('user',JSON.stringify({
        _id: data._id,
        name: data.name,
        email:data.email
      }))

      setUser({
      _id: data._id,
      name: data.name,
      email: data.email
      });

      toast.success('Logged in!');
    } catch (error) {
      const message =
        error.response?.data?.message || 'Login failed';
      toast.error(message);
    }
  };

  const registerUser = async (name, email, password) => {
    try {
      const res = await api.post('/users', {
        name,
        email,
        password,
      });

      const data = res.data;

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({
        _id: data._id,
        name: data.name,
        email: data.email
      }))
      setUser({
        _id: data._id,
        name: data.name,
        email: data.email,
      });

      toast.success('Account created!');
    } catch (error) {
      const message =
        error.response?.data?.message || 'Registration failed';
      toast.error(message);
    }
  };

  const logoutUser = () => {
    localStorage.removeItem('token');
    locatStorage.removeItem('user')
    setUser(null)
    toast.success('Logged out');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loginUser,
        registerUser,
        logoutUser,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
