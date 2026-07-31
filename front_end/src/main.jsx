import React from 'react';
import ReactDOM from 'react-dom/client';
import Routing from './Routes/Routing';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './styles/Principales/Global.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Routing />
  </React.StrictMode>
);

 