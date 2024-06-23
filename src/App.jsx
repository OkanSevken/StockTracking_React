import React from 'react';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import './App.css';
import 'semantic-ui-css/semantic.min.css';
import HomePage from './pages/HomePage';
import PartList from './pages/PartList';
import Sidebar from './components/Sidebar/Sidebar';
import Login from './pages/Login';
import PartMovementAdd from './pages/PartMovementAdd';

const App = () => {
  const location = useLocation();

  // Giriş ekranında sidebar görünmesin
  const shouldShowSidebar = location.pathname !== '/login';

  return (
    <div className="container">
      {shouldShowSidebar && <Sidebar />}
      <div className="content">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/partList" element={<PartList />} />
          <Route path="/login" element={<Login />} />
          <Route path='/partMovement' element={<PartMovementAdd/>} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
