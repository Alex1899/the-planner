import React, { useState } from "react";
import FormInput from "../form-input/form-input.component";
import CustomButton from "../custom-button/custom-button.component";
import AlertDialog from "../alert-dialog/alert-dialog.component";
import { Spinner } from "react-bootstrap";
import "./sign-in.styles.scss";
import { useStateValue } from "../../contexts/auth.context";

const SignIn = () => {
  const { loginUser } = useStateValue();
  const [alert, setAlert] = useState({ show: false, text: "" });
  const [spinner, toggleSpinner] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    toggleSpinner(!spinner);
    try{
      await loginUser({ ...form });
    }catch(e){
      setAlert({show: true, text: e.message})
    }
    toggleSpinner(!spinner);
  };

  // const handleGoogleLogin = async (googleData) => {
  //   if (googleData.error && googleData.error !== "popup_closed_by_user") {
  //     console.log(googleData);
  //     setAlert({
  //       show: true,
  //       text: "Cookies are disabled in this environment \n\nYou can not sign in with Google :(",
  //     });
  //     return;
  //   }
  //   const res = await authAxios.post("/users/auth/google", {
  //     token: googleData.tokenId,
  //   });
  //   const data = await res.data;
  //   console.log(data);
  //   authContext.setAuthState(data);
  //   // store returned user somehow
  // };

  const handleChange = (event) => {
    const { value, name } = event.target;
    setForm({ ...form, [name]: value });
  };

  return (
    <div className="sign-in">
      {alert.show && (
        <AlertDialog
          show={alert.show}
          handleClose={() => setAlert({ ...alert, show: !alert.show })}
          text={alert.text}
        />
      )}
      {spinner ? (
        <Spinner
          animation="border"
          variant="dark"
          size="lg  "
          className="m-auto"
        />
      ) : (
        <>
          <h2>I already have an account</h2>
          <span>Sign in with your email and password</span>

          <form onSubmit={handleSubmit}>
            <FormInput
              name="email"
              type="email"
              onChange={handleChange}
              value={form.email}
              label="email"
              required
            />
            <FormInput
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              label="password"
              required
            />
            <div className="buttons">
              <CustomButton type="submit"> Sign in </CustomButton>
              {/* <GoogleLogin
            clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
            buttonText="Log in with Google"
            onSuccess={handleGoogleLogin}
            onFailure={handleGoogleLogin}
            cookiePolicy="single_host_origin" 
          />*/}
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default SignIn;
