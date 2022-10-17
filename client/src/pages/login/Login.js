import "./login.css";
import {useContext, useRef} from "react";
import { loginCall } from "../../apiCalls";
import { AuthContext } from "../../context/AuthContext"; 
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from "react-router-dom";

export default function Login() {
  const email = useRef();
  const password = useRef();
  const {isFetching,dispatch} = useContext(AuthContext)
  const navigate = useNavigate();

  const handleClick = (e)=>{
    e.preventDefault();
    loginCall({
      email:email.current.value,
      password:password.current.value
    },
    dispatch)
    
    //console.log(user);
  }

  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">Facebook</h3>
          <span className="loginDesc">
            Connect with friends and the world around you on Facebook.
          </span>
        </div>
        <div className="loginRight">
          <form className="loginBox" onSubmit={handleClick}>
            <input 
            placeholder="Email" 
            type="email" 
            className="loginInput" 
            required 
            ref={email}
            />
            <input 
            placeholder="Password" 
            type="password" 
            className="loginInput" 
            minLength="6"
            required 
            ref={password}
            />
            <button className="loginButton" type="submit" disabled={isFetching}>
            {isFetching?(<CircularProgress color="inherit"/>): ("Log In")}
            </button>
            <span className="loginForgot">Forgot Password?</span>
            <button className="loginRegisterButton" onClick={(e)=>{
              e.preventDefault()
              navigate("/register")
            }}>
            {isFetching?(<CircularProgress color="inherit"/>): ("Create a New Account")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
