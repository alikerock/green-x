import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
// import { firebase } from './firebase';
import { BrowserRouter } from "react-router";

// console.log(firebase);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

