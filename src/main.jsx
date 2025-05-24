import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import Home from './pages/Home';
import Login from './pages/Login';
import './index.css';
import Register from './pages/Register';
import Venue from './pages/VenuePage';
import Profile from './pages/Profile';
import ManagerRegister from './pages/ManagerRegister';
import ManagerProfile from './pages/ManagerProfile';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="managerregister" element={<ManagerRegister />} />
          <Route path="venue/:id" element={<Venue />} />
          <Route path="profile" element={<Profile />} />
          <Route path="managerprofile" element={<ManagerProfile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
