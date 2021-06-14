import React, { useState } from "react";
import FormInput from "../form-input/form-input.component";
import CustomButton from "../custom-button/custom-button.component";
import AlertDialog from "../alert-dialog/alert-dialog.component";
import "./sign-up.styles.scss";
import { useHistory } from "react-router";

const SignUp = () => {
  const [alert, setAlert] = useState({ show: false, text: "" });
  const history = useHistory();
  const [form, setForm] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { fullname, username, email, password, confirmPassword } = form;

  const clearForm = () => {
    setForm({
      fullname: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();



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

      <h2 className="title">I do not have a account</h2>
      <span>Sign up with your email and password</span>
      <form className="sign-up-form" onSubmit={handleSubmit}>
        <FormInput
          type="text"
          name="fullname"
          value={fullname}
          onChange={handleChange}
          label="Fullname"
          required
        />
        <FormInput
          type="text"
          name="username"
          value={username}
          onChange={handleChange}
          label="Username"
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
    </div>
  );
};

export default SignUp;