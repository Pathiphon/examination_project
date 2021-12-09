import { TextField } from '@mui/material';
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
    const [firstname, setFirstname] = useState("")
    const [lastname, setLastname] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const [, setToken] = useContext(UserContext)

    const submitRegistration = async ()=>{
        const requestOptions = {
            method: "POST",
            headers:{"Content-Type":"application/json"},
            body: JSON.stringify({email:email,firstname:firstname,lastname:lastname,hashed_password:password}),
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
        <div className="container mx-auto">
            <Card variant="outlined" sx={{ maxWidth: 400 }} className="container"  >
            <FormControl onSubmit={handleSubmit} className="container ">
                <h1 className="mx-auto">สมัครสมาชิก</h1>
                <div className="mb-3 row px-3">
                    <TextField  label="ชื่อ" variant="filled" 
                    value={firstname} 
                    onChange={(e)=>setFirstname(e.target.value)} required
                    />
                </div>
                <div className="mb-3 row px-3">
                    <TextField  label="นามสกุล" variant="filled" 
                    value={lastname} 
                    onChange={(e)=>setLastname(e.target.value)} required
                    />
                </div>
                <div className="mb-3 row px-3">
                    <TextField  label="Email Address" variant="filled"
                    value={email} 
                    onChange={(e)=>setEmail(e.target.value)} required
                    />
                </div>
                <div className="mb-3 row px-3">
                    <TextField  label="รหัสผ่าน" variant="filled"
                    type="password"
                    value={password} 
                    onChange={(e)=>setPassword(e.target.value)} required
                    />
                </div>
                <div className="mb-3 row px-3">
                    <TextField  label="ยืนยันรหัสผ่าน" variant="filled"
                    type="password"
                    value={confirmationPassword} 
                    onChange={(e)=>setConfirmationPassword(e.target.value)} required
                    />
                </div>
                <div>
                    <ErrorMessage message={errorMessage}/>
                </div>
                <Button variant="contained" color="success" type="submit" className="w-50 mx-auto mb-2">ยืนยันการสมัคร</Button>
            </FormControl>
            </Card>
        </div>
    );
};
export default Register;