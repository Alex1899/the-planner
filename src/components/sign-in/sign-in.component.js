import React, { useState, useEffect } from "react";
import FormInput from "../form-input/form-input.component";
import CustomButton from "../custom-button/custom-button.component";
import AlertDialog from "../alert-dialog/alert-dialog.component";
import { Spinner } from "react-bootstrap";
import "./sign-in.styles.scss";
import { useStateValue } from "../../contexts/auth.context";
import { signInWithGoogle } from "../../firebase/firebase.utils";

const SignIn = () => {
  const { loginUser, setUser } = useStateValue();
  const [alert, setAlert] = useState({ show: false, text: "" });
  const [spinner, toggleSpinner] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    return () => {
      toggleSpinner(!spinner);
    };
  }, [spinner]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    toggleSpinner(!spinner);
    try {
      await loginUser({ ...form });
    } catch (e) {
      setAlert({ show: true, text: e.message });
    }
  };

  const handleChange = (event) => {
    const { value, name } = event.target;
    setForm({ ...form, [name]: value });
  };

  const googleSignIn = async () => {
    const user = await signInWithGoogle();
    console.log(user);
    setUser(user);
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
              label="Email"
              required
            />
            <FormInput
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              label="Password"
              required
            />
            <div className="buttons">
              <CustomButton type="submit"> Sign in </CustomButton>
              <CustomButton
                type="button"
                onClick={() => googleSignIn()}
                isGoogleSignIn
              >
                <div className="d-flex align-items-center">
                  <img
                    src="/assets/google.svg"
                    alt="google"
                    width={20}
                    className="mr-2"
                  />
                  <span>Google Login</span>
                </div>
              </CustomButton>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default SignIn;
