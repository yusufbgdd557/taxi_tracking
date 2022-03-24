import './Login.scss'
import React, { useRef, useState } from 'react'
import PropTypes from 'prop-types';
import { toast } from "react-toastify";
import ReCAPTCHA from "react-google-recaptcha";

const Login = (props) => {
  const [showReCaptcha, setShowReCaptcha] = useState(0);
  const [clickRecaptcha, setClickRecaptcha] = useState(false)
  const email = useRef();
  const password = useRef();

  const loginBackend = (user_email, user_password) => {
    if (showReCaptcha >= 3 && !clickRecaptcha) {
      toast.warn("Please verify recaptcha")
    } else if (user_email === "" || user_password === "") {
      toast.warn("Enter email or password !");
    } else {
      fetch("http://localhost:8000/login", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ "email": user_email, "password": user_password })
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.access_token) {
            props.setToken(data.access_token);
            props.setEmail(data.user_email);
            window.location.href = '/main';
          } else {
            toast.error("Wrong email or password");
            let setTheshowReCaptcha = showReCaptcha + 1
            setShowReCaptcha(setTheshowReCaptcha);
          }
        });
    }
  };

  return (
    <div className="login-container">
      <div class="login-wrap">
        <div class="login-html">
          <input id="tab-1" type="radio" name="tab" class="sign-in" checked /><label for="tab-1" class="tab">Sign In</label>
          <input id="tab-2" type="radio" name="tab" class="sign-up" /><label for="tab-2" class="tab"></label>
          <div class="login-form">
            <div class="sign-in-htm">
              <div class="group">
                <label for="user" class="label">Username</label>
                <input id="user" type="text" class="input" ref={email} />
              </div>
              <div class="group">
                <label for="pass" class="label">Password</label>
                <input id="pass" type="password" class="input" data-type="password" ref={password} />
              </div>
              <br />
              <div class="group">
                {
                  showReCaptcha >= 3 && (
                    <>
                      <ReCAPTCHA
                        className='recaptcha'
                        sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                        onChange={(value) => setClickRecaptcha(true)}
                      />
                      <br />
                    </>
                  )
                }
                <input type="submit" class="button" value="Sign In" onClick={() => loginBackend(email.current.value, password.current.value)} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login;

Login.propTypes = {
  setToken: PropTypes.func,
  setEmail: PropTypes.func
};
