import React, { useEffect, useState, createContext, useContext } from 'react';
import { projectAuth } from '../firebase/config';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = projectAuth.onAuthStateChanged(user => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsub;
  }, []);

  const sendOtp = (phone, recaptchaVerifier) => {
    return projectAuth.signInWithPhoneNumber(phone, recaptchaVerifier);
  };

  const verifyOtp = (confirmationResult, otp) => {
    return confirmationResult.confirm(otp);
  };

  const signOut = () => {
    return projectAuth.signOut();
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        sendOtp,
        verifyOtp,
        signOut
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
