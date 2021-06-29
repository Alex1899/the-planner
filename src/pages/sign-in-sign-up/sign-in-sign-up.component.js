import React from "react";
import { useMediaQuery } from "react-responsive";

import SignIn from "../../components/sign-in/sign-in.component";
import SignUp from "../../components/sign-up/sign-up.component";

import "./sign-in-sign-up.styles.scss";

const SignInAndSignUpPage = () => {
  const isSmallScreen = useMediaQuery({ query: "(max-width: 400px)" });

  return (
    <div
      className="auth-page-div"
      style={{
        backgroundImage: `url(/assets/big-screen-bg.jpg)`,
        backgroundSize: isSmallScreen ? "auto" : "cover",
      }}
    >
      <div className="sign-in-and-sign-up">
        <SignIn />
        <SignUp />
      </div>
    </div>
  );
};

export default SignInAndSignUpPage;
