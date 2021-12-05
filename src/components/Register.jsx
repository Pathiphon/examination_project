import { TextField } from '@mui/material';
import React, { useState,useContext  } from 'react'
import Button from '@mui/material/Button';
import { UserContext } from '../context/UserContext'
import ErrorMessage from './ErrorMessage';

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
        <div>
            <form onSubmit={handleSubmit}>
                <h1>สมัครสมาชิก</h1>
                <div className="mb-3">
                    <TextField className="w-25"  label="ชื่อ" variant="filled"
                    value={firstname} 
                    onChange={(e)=>setFirstname(e.target.value)} required
                    />
                </div>
                <div className="mb-3">
                    <TextField className="w-25"  label="นามสกุล" variant="filled"
                    value={lastname} 
                    onChange={(e)=>setLastname(e.target.value)} required
                    />
                </div>
                <div className="mb-3">
                    <TextField className="w-25"  label="Email Address" variant="filled"
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
                <div className="mb-3">
                    <TextField className="w-25"  label="ยืนยันรหัสผ่าน" variant="filled"
                    type="password"
                    value={confirmationPassword} 
                    onChange={(e)=>setConfirmationPassword(e.target.value)} required
                    />
                </div>
                <div>
                    <ErrorMessage message={errorMessage}/>
                </div>
                <Button variant="contained" color="success" type="submit">ยืนยันการสมัคร</Button>
            </form>
        </div>
    );
};
export default Register;