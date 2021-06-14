import React, { createContext, useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import AlertDialog from "../components/alert-dialog/alert-dialog.component";
import { auth, getCurrentUser, signInWithEmail } from "../firebase/firebase.utils";

const AuthContext = createContext();
const { Provider } = AuthContext;

const AuthProvider = ({ children }) => {
  const [alert, setAlert] = useState({ show: false, text: "" });
  const history = useHistory();

  const [currentUser, setAuthState] = useState(null);

  const setAuthInfo = (user) => {
    setAuthState({ ...user });
  };

  //   const updateAvatar = (avatar) => {
  //     let updatedUserInfo = { ...authState.userInfo, avatar };
  //     localStorage.setItem("userInfo", JSON.stringify({ ...updatedUserInfo }));
  //     setAuthState({ ...authState, userInfo: updatedUserInfo });
  //   };

  const loginUser = async ({email, password}) => {
      let user = await signInWithEmail({email, password})
      setAuthInfo(user)
  }

  const logout = () => {
    auth.logout();
    setAuthState(null);
  };


  return (
    <Provider
      value={{
        currentUser: currentUser,
        setAuthState: (user) => setAuthInfo(user),
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
