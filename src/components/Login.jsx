import React, { useState, useContext } from "react";
import { FormControl, Input, InputLabel, TextField } from "@mui/material";
import ErrorMessage from "./ErrorMessage";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  CssBaseline,
  Grid,
} from "@mui/material";
import index_img from "../img/index.png";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { UserContext } from "../context/UserContext";
import { useNavigate  } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [, setToken] = useContext(UserContext);

  const navigate = useNavigate();

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
      navigate('/')
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitLogin();
  };

  return (
    <div className="w-100 p-4"  style={{backgroundColor:"#ffffff",borderRadius: '10px'}}>
                <form
                  onSubmit={handleSubmit}
                  className="container mx-auto text-center"
                >
                  <Typography
                    variant="h5"
                    sx={{ mb: 2 }}
                    component="div"
                    style={{ color: "black" }}
                  >
                    เข้าสู่ระบบ
                  </Typography>
                  <FormControl
                    sx={{ m: 1, width: "80%" }}
                    className="container"
                    variant="standard"
                  >
                    <InputLabel>E-mail</InputLabel>
                    <Input
                      type="email"
                      variant="standard"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </FormControl>
                  <FormControl
                    sx={{ m: 1, width: "80%" }}
                    className="container"
                    variant="standard"
                  >
                    <InputLabel>รหัสผ่าน</InputLabel>
                    <Input
                      variant="standard"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </FormControl>
                  <FormControl
                    sx={{ m: 1, width: "80%" }}
                    className="container"
                    variant="standard"
                  >
                    {errorMessage ? (
                      <ErrorMessage message={errorMessage} />
                    ) : (
                      <></>
                    )}
                  </FormControl>
                  <FormControl
                    sx={{ m: 1, width: "75%" }}
                    className="container"
                    variant="standard"
                  >
                  <Button
                variant="contained"
                size="large"
                type="submit"
                sx={{
                  backgroundColor: "#000000",
                  ":hover": {
                    bgcolor: "#000033",
                  },
                  borderRadius: "10px",
                }}
              >
                เข้าสู่ระบบ
              </Button>
                  </FormControl>
                </form>
             
    </div>
  );
};
export default Login;
