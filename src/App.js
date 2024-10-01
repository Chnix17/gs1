import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Sidebar from './pages/Sidebar';
import Login from './pages/Login';
import VehicleEntry from './pages/VehicleEntry';
import Venue from './pages/Venue';
import Dashboard from './pages/dashboard';
import Equipment from './pages/Equipment';
import User from './pages/User';
import { Toaster } from 'sonner';
import './App.css'; 

const App = () => {
    const defaultUrl = "http://localhost/coc/gsd/";
    if (localStorage.getItem("url") !== defaultUrl) {
        localStorage.setItem("url", defaultUrl);
    }

    return (
        <div className="app-container">
            <Toaster richColors position='top-center' duration={1500} />
            <main className="main-content">
                <Routes>
                    <Route path="/" element={<Login />} /> 
                    <Route path="/VehicleEntry" element={<VehicleEntry />} /> 
                    <Route path="/Venue" element={<Venue />} /> 
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/Equipment" element={<Equipment />} />
                    <Route path="/User" element={<User />} />
                    <Route path="*" element={<div>404 Not Found</div>} /> 
                </Routes>
            </main>
        </div>
    );
};

export default App;
