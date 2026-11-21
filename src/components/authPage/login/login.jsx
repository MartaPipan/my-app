import "./login.css";
import {useRef, useState, useEffect } from "react";
import {SocialAuthList} from "../socialAuthList/socialAuthList";
import {Password} from "../password/password";
import {toast} from "react-toastify";
import {userLogin} from "../../../service/user.service";

export const Login = (props) => {
  const {isActive} = props;
  const [rememberMe, setRememberMe] = useState(false);
  // const [email, setEmail] = useState('')
  const emailRef = useRef();
  const passwordRef = useRef();

  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser && emailRef.current) {
      const parsedUser = JSON.parse(savedUser);
      emailRef.current.value = parsedUser.email;
      setRememberMe(true);
    }
  }, []);

  // useEffect(() => {
  //   toast.success("This is success")
  //   toast.error("This is error")
  //   toast.warning("This is warning")
  // })

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = emailRef.current.value.trim();
    const password = passwordRef.current.value;

    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    const checkEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!checkEmail.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      await userLogin(email, password, rememberMe);
      emailRef.current.value = "";
      passwordRef.current.value = "";
      if (!rememberMe) {
        emailRef.current.value = "";
      }
      toast.success(
        rememberMe
          ? "Login success! Saved in Local Storage"
          : "Login success! Saved in Session Storage"
      );
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className={["form-panel", isActive ? "form-panel--visible" : "form-panel--login-hidden"].join(" ")}>
      <div className={"form-inner"}>
        <h2 className={"form-title"}>Sign In</h2>

        <form onSubmit={handleSubmit} noValidate className={"auth-form"}>
          <div className={"field-group"}>
            <input
              type="text"
              name="login"
              ref={emailRef}
              autoComplete="email"
              // value={email}
              // onChange={e => setEmail(e.target.value)}
              placeholder="Login or Email"
              className={"auth-input"}
            />
          </div>

          <Password passwordRef={passwordRef} />
          <div className={"form-options"}>
            <label className={"checkbox-label"}>
              <input 
              type="checkbox" 
              name="rememberMe" 
              checked={rememberMe} 
              onChange={(e) => setRememberMe(e.target.checked)} 
              className={"checkbox-input"} />
              <span>Remember me</span>
            </label>

            <button
              type="button"
              /*onClick={() => onForgotPassword(identifier)}*/
              onClick={() => toast.info("Password recovery coming soon")}
              className={"forgot-link"}
            >
              Forgot password?
            </button>
          </div>

          {/* Submit Button */}
          <button type="submit" className={"primary-btn"}>
            LOGIN
          </button>
        </form>

        {/* Social Auth Section */}
        <div className={"social-section"}>
          <div className={"social-divider"}>
            <span className={"social-divider-line"} />
            <span className={"social-divider-text"}>or sign in with</span>
            <span className={"social-divider-line"} />
          </div>

          <SocialAuthList />
        </div>
      </div>
    </div>
  );
};
