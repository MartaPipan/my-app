import "./registration.css";
import {useRef, useState} from "react";
import {toast} from "react-toastify";
import {SocialAuthList} from "../socialAuthList/socialAuthList";
import {Password} from "../password/password";
import {userRegister} from "../../../service/user.service";

export const Registration = (props) => {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmaPasswordRef = useRef(null);

  const [errors, setErrors] = useState({
    email: [],
    password: [],
    currentPassword: [],
  });

  const onSubmit = async (e) => {
    e.preventDefault();

    const currentErrors = {
      email: [],
      password: [],
      currentPassword: [],
    };

    const email = emailRef.current.value.trim();
    const password = passwordRef.current.value;
    const confirmaPassword = confirmaPasswordRef.current.value;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      currentErrors.email.push("Email should be added");
    } else if (!emailRegex.test(email)) {
      currentErrors.email.push("Please enter a valid email address");
    }
    if (!password) {
      currentErrors.password.push("Password should be added");
    } else if (password.length < 6) {
      currentErrors.password.push("Password must be at least 6 characters");
    }
    if (!confirmaPassword) {
      currentErrors.currentPassword.push("Confirm password should be added");
    }
    if (confirmaPassword && password && confirmaPassword !== password) {
      currentErrors.currentPassword.push("Password does not match");
    }

    const hasErrors = currentErrors.email.length > 0 || currentErrors.password.length > 0 || currentErrors.currentPassword.length > 0;

    if (hasErrors) {
      setErrors(currentErrors);
      return;
    }

    try {
      await userRegister(email, password);
      setErrors({email: [], password: [], currentPassword: []});
      emailRef.current.value = "";
      passwordRef.current.value = "";
      confirmaPasswordRef.current.value = "";

      toast.success("Registration successful!");
    } catch (err) {
      setErrors({...currentErrors, email: [err.message]});
      toast.error(err.message);
    }
  };

  return (
    <div className={`form-panel form-panel--visible`}>
      <div className="form-inner">
        <h2 className="form-title form-title--compact">Create Account</h2>

        <form onSubmit={onSubmit} noValidate className="auth-form auth-form--compact">
          <div className="field-group">
            <input 
            ref={emailRef} 
            type="email" 
            name="email" 
            autoComplete="email" 
            placeholder="Email" 
            className={`auth-input`} />
          </div>
          {errors.email.map((error, index) => (
            <p key={index}>{error}</p>
          ))}

          <Password placeholder="Password" isRegistration={true} passwordRef={passwordRef} />
          {errors.password.map((error, index) => (
            <p key={index}>{error}</p>
          ))}
          <Password placeholder="Confirm Password" name="confirmPassword" isRegistration={true} passwordRef={confirmaPasswordRef} />
          {errors.currentPassword.map((error, index) => (
            <p key={index}>{error}</p>
          ))}

          <button type="submit" className="primary-btn">
            REGISTER
          </button>
        </form>

        <div className="social-section social-section--compact">
          <div className="social-divider">
            <span className="social-divider-line" />
            <span className="social-divider-text">or register with</span>
            <span className="social-divider-line" />
          </div>

          <SocialAuthList />
        </div>
      </div>
    </div>
  );
};
