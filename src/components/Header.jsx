import React,{useContext, useState,useEffect} from "react"
import { UserContext} from "../context/UserContext"
import Button from '@mui/material/Button';

const Header=()=>{
    const [token,setToken] = useContext(UserContext)
    const [user,setUser] = useState(null)
 
    const handleLogout=()=>{
        setToken(null)
    }

    const fetchUser = async () => {
        const requestOptions = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        };
  
        const response = await fetch("/api/users/me", requestOptions);
  
        if (!response.ok) {
          console.log(response);
        }
        const data = await response.json()
        setUser(data)
        console.log(user);
        
      };
      

    return(
        <>
        <div>
            <h1> login แล้ว</h1>
            {token &&(<Button onClick={handleLogout}>Logout</Button>)}

        </div>
        </>
    );
};
export default Header;