import { TextField,Typography,InputLabel,Input } from '@mui/material';
import React, { useState,useContext  } from 'react'
import Button from '@mui/material/Button';
import { UserContext } from '../context/UserContext'
import ErrorMessage from './ErrorMessage';

import Card from '@mui/material/Card';
import FormControl from '@mui/material/FormControl';

const Register = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmationPassword, setConfirmationPassword] = useState("")
    const [name, setName] = useState("")
    const [lastname, setLastname] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const [, setToken] = useContext(UserContext)

    const submitRegistration = async ()=>{
        const requestOptions = {
            method: "POST",
            headers:{"Content-Type":"application/json"},
            body: JSON.stringify({email:email,name:name,hashed_password:password}),
        }
        const response = await fetch("/api/users",requestOptions)
        console.log(response);
        const data = await response.json()

        if (!response.ok){
            setErrorMessage(data.detail) 
        }else{
            setToken(data.access_token)
        }
    }

    const handleSubmit = (e)=>{
        e.preventDefault()
        if(password===confirmationPassword && password.length>5){
            submitRegistration()
        }else{
            setErrorMessage("รหัสผ่านไม่ถูกต้อง")
        }
    }
    return (
        <div className="container w-100 p-4 mx-auto text-center" style={{backgroundColor:"#ffffff",borderRadius: '10px'}}>
            <form onSubmit={handleSubmit} className="container mx-auto text-center w-100">
            <Typography
                    variant="h5"
                    sx={{ mb: 2 }}
                    component="div"
                    style={{ color: "black" }}
                  >
                    สมัครสมาชิก
                  </Typography>
                  <FormControl 
                    sx={{ m: 1, width: "80%" }}
                    className="container"
                    variant="standard"
                  >
                      <InputLabel>ชื่อ - นามสกุล</InputLabel>
                    <Input   variant="standard" 
                    value={name} 
                    onChange={(e)=>setName(e.target.value)} required
                    />
                </FormControl>
                <FormControl 
                    sx={{ m: 1, width: "80%" }}
                    className="container"
                    variant="standard"
                  >
                      <InputLabel>E-mail</InputLabel>
                    <Input   variant="standard"
                    value={email} 
                    onChange={(e)=>setEmail(e.target.value)} required
                    />
                </FormControl>
                <FormControl
                    sx={{ m: 1, width: "80%" }}
                    className="container"
                    variant="standard"
                  >
                      <InputLabel>รหัสผ่าน</InputLabel>
                    <Input  variant="standard"
                    type="password"
                    value={password} 
                    onChange={(e)=>setPassword(e.target.value)} required
                    />
                </FormControl>
                <FormControl
                    sx={{ m: 1, width: "80%" }}
                    className="container"
                    variant="standard"
                  >
                      <InputLabel>ยืนยันรหัสผ่าน</InputLabel>
                    <Input  variant="standard"
                    type="password"
                    value={confirmationPassword} 
                    onChange={(e)=>setConfirmationPassword(e.target.value)} required
                    />
                </FormControl>
                <div>
                    <ErrorMessage message={errorMessage}/>
                </div>
                <FormControl
                    sx={{ m: 3, width: "75%" }}
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
                ยืนยันการสมัคร
              </Button>
                  </FormControl>
            </form>
        </div>
    );
};
export default Register;