import Register from './components/Register'
import Header from './components/Header';
import Login from './components/Login'
import React,{ useContext, useEffect, useState } from 'react';
import {UserContext} from "./context/UserContext"

const App=()=> { 
  const [token]= useContext(UserContext)
  
  return (
    <div className="App">
      {!token?(
        <div>
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
