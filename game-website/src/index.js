import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import axios from 'axios';


const root = ReactDOM.createRoot(document.getElementById('root'));
axios.defaults.baseURL = 'http://games.zenithgaming.horse';
root.render(
  
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

