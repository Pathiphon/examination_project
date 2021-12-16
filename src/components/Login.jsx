import React, { useState, useContext } from "react";
import { TextField } from '@mui/material';
import Button from '@mui/material/Button';
import ErrorMessage from "./ErrorMessage";
import { UserContext } from "../context/UserContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [, setToken] = useContext(UserContext);

  const submitLogin = async () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: JSON.stringify(
        `grant_type=&username=${email}&password=${password}&scope=&client_id=&client_secret=`
      ),
    };

    const response = await fetch("/api/token", requestOptions);
    const data = await response.json();

    if (!response.ok) {
      setErrorMessage(data.detail);
    } else {
      setToken(data.access_token);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitLogin();
  };

return (
    <div>
        <form onSubmit={handleSubmit}>
            <h1>เข้าสู่ระแบบ</h1>
            <div className="mb-3">
                <TextField className="w-25" type="email"  label="Email Address" variant="filled"
                value={email} 
                onChange={(e)=>setEmail(e.target.value)} required
                />
            </div>
            <div className="mb-3">
                <TextField className="w-25"  label="รหัสผ่าน" variant="filled"
                type="password"
                value={password} 
                onChange={(e)=>setPassword(e.target.value)} required
                />
            </div>
            <div>
              {errorMessage?(
                <ErrorMessage message={errorMessage}/>
                ):(<></>)}
            </div>
            <Button variant="contained" color="success" type="submit">เข้าสู่ระแบบ</Button>
        </form>
    </div>
);
};
export default Login;