import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Profile from "./pages/profile/Profile";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

function App() {
  const state = useContext(AuthContext);
  //console.log(state,'home')
  return (
    <Router>
      <Routes>
      <Route exact path="/" element={state.user?(<Home/>):(<Register/>)}/>
        <Route path="/login" element={state.user?(<Navigate replace to="/" />):(<Login/>)}/>
        <Route path="/register" element={state.user?(<Navigate replace to="/" />):(<Register/>)}/>
        <Route path="/profile/:username" element={<Profile/>}/>
      </Routes>
    </Router>
  );
}

export default App;
