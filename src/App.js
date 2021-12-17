import Register from './components/Register'
import Header from './components/Header';
import Login from './components/Login'
import 'bulma/css/bulma.min.css';
import { GlobalStyles } from '@mui/material';


import './App.css'
import React,{ useContext, useEffect, useState } from 'react';
import {UserContext} from "./context/UserContext"


const App=()=> { 
  const [token]= useContext(UserContext)
  
  return (
    <div className="container" >
      
      {!token?(
        <div className="mx-auto container">
          <Register/>
          <Login/>
          </div>
      ):(
          <Header />
          
      )}
      
    </div>
  );
}

export default App;
