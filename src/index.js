import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { UserProvider } from './context/UserContext';
import { BrowserRouter } from 'react-router-dom'

ReactDOM.render(
  //เคยเปลี่ยน***********************************************************
  <UserProvider>
    <BrowserRouter>
    <App />
    </BrowserRouter>
  </UserProvider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

