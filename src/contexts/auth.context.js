import React, { createContext, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import AlertDialog from "../components/alert-dialog/alert-dialog.component";
import { auth, signInWithEmail } from "../firebase/firebase.utils";

const AuthContext = createContext();
const { Provider } = AuthContext;

const AuthProvider = ({ children }) => {
  const userInfo = localStorage.getItem("userInfo");

  const [alert, setAlert] = useState({ show: false, text: "" });
  const [currentUser, setCurrentUser] = useState(
    userInfo ? JSON.parse(userInfo) : null
  );

  //   const updateAvatar = (avatar) => {
  //     let updatedUserInfo = { ...authState.userInfo, avatar };
  //     localStorage.setItem("userInfo", JSON.stringify({ ...updatedUserInfo }));
  //     setAuthState({ ...authState, userInfo: updatedUserInfo });
  //   };

  const setUser = (user) => {
    if (user) {
      localStorage.setItem("userInfo", JSON.stringify(user));
    }
    setCurrentUser((_) => user);
  };

  const loginUser = async ({ email, password }) => {
    let user = await signInWithEmail({ email, password });
    console.log("fetched user from firebase");
    setUser(user);
  };

  const logout = () => {
    auth.signOut();
    localStorage.removeItem("userInfo");
    setCurrentUser(null);
  };

  return (
    <Provider
      value={{
        currentUser: currentUser,
        setUser: (user) => setUser(user),
        loginUser,
        logout,
      }}
    >
      {alert.show && (
        <AlertDialog
          show={alert.show}
          handleClose={() => setAlert({ ...alert, show: !alert.show })}
          text={alert.text}
        />
      )}
      {children}
    </Provider>
  );
};

const useStateValue = () => useContext(AuthContext);

export { AuthProvider, useStateValue };
