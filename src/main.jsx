import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import Home from './pages/home';
import Login from './pages/Login';
import './index.css';
import Register from './pages/Register';
import Venue from './pages/VenuePage';
import ManagerLogin from './pages/ManagerLogin';
import Profile from './pages/Profile';
import ManagerRegister from './pages/ManagerRegister';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />}
           />
           <Route path="managerregister" element={<ManagerRegister />} />
           <Route path="managerlogin" element={<ManagerLogin />}
           />
           <Route path="manager" element={<ManagerLogin />}
           />
            <Route path="venue/:id" element={<Venue />} />

           <Route path="profile" element={<Profile />}
           />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
