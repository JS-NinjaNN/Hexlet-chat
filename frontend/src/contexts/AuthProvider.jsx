import React, {
  createContext, useMemo, useState, useContext,
} from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';

import { chatApiRoutes } from '../routes/routes.js';
import { actions as loadingStatusActions } from '../slices/loadingStatusSlice.js';

const AuthContext = createContext({});

const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();

  const savedUserData = JSON.parse(localStorage.getItem('user'));
  const [user, setUser] = useState(savedUserData);

  const context = useMemo(() => {
    const logIn = async (userData) => {
      const { data } = await axios.post(chatApiRoutes.login(), userData);
      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
    };

    const logOut = () => {
      localStorage.removeItem('user');
      dispatch(loadingStatusActions.unload());
      setUser(null);
    };

    const signUp = async (userData) => {
      const { data } = await axios.post(chatApiRoutes.signup(), userData);
      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
    };

    const loggedIn = Boolean(user);

    const getUserName = () => (user?.username ? user.username : null);

    const getAuthHeader = () => (user?.token ? { Authorization: `Bearer ${user.token}` } : {});

    return ({
      logIn, logOut, signUp, loggedIn, getUserName, getAuthHeader,
    });
  }, [dispatch, user]);

  return (
    <AuthContext.Provider value={context}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);
export { AuthContext, useAuth };
export default AuthProvider;
