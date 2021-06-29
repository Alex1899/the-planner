import React, { useState, useEffect } from "react";
import FormInput from "../form-input/form-input.component";
import CustomButton from "../custom-button/custom-button.component";
import AlertDialog from "../alert-dialog/alert-dialog.component";
import "./sign-up.styles.scss";
import { Spinner } from "react-bootstrap";
import { useStateValue } from "../../contexts/auth.context";
import validator from "validator";
const SignUp = () => {
  const [alert, setAlert] = useState({ show: false, text: "" });
  const { createUser } = useStateValue();
  const [spinner, toggleSpinner] = useState(false);

  const [form, setForm] = useState({
    displayName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { displayName, email, password, confirmPassword } = form;

  useEffect(() => {
    return () => {
      toggleSpinner(() => false);
      clearForm();
    };
  }, []);

  const clearForm = () => {
    setForm({
      displayName: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!displayName || !email || !password || !confirmPassword) {
      setAlert({ show: true, text: "Please fill out all fields" });
      return;
    }
    if (confirmPassword !== password) {
      setAlert({ show: true, text: "Passwords do not match" });
      return;
    }
    if (!validator.isEmail(email)) {
      setAlert({ show: true, text: "Please enter correct email" });
      return;
    }
    toggleSpinner(() => true);
    createUser({ email, password }, { displayName });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm({ ...form, [name]: value });
  };

  return (
    <div className="sign-up">
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
          <h2 className="title">I do not have a account</h2>
          <span>Sign up with your email and password</span>
          <form className="sign-up-form" onSubmit={handleSubmit}>
            <FormInput
              type="text"
              name="displayName"
              value={displayName}
              onChange={handleChange}
              label="Display Name"
              required
            />
            <FormInput
              type="email"
              name="email"
              value={email}
              onChange={handleChange}
              label="Email"
              required
            />
            <FormInput
              type="password"
              name="password"
              value={password}
              onChange={handleChange}
              label="Password"
              required
            />
            <FormInput
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleChange}
              label="Confirm Password"
              required
            />
            <CustomButton type="submit">SIGN UP</CustomButton>
          </form>
        </>
      )}
    </div>
  );
};

export default SignUp;
