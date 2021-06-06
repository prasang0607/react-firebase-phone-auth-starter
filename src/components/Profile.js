import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { currentUser, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (err) {}
  };

  return (
    <div>
      <p>
        <strong>UID:</strong> {currentUser.uid}
      </p>
      <p>
        <strong>Phone:</strong> {currentUser.phoneNumber}
      </p>
      <button type="button" className="button mt-4" onClick={handleSignOut}>
        Logout
      </button>
    </div>
  );
};

export default Profile;
