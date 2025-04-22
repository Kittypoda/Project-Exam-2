import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import Home from './pages/home';
import Login from './pages/Login';
import './index.css';
import Register from './pages/Register';
import Avenue from './pages/AvenuePage';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />}
           />
            <Route path="avenue" element={<Avenue />}
           />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
