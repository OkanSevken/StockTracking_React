import React from 'react';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import './App.css';
import 'semantic-ui-css/semantic.min.css';
import HomePage from './pages/HomePage';
import PartList from './pages/PartList';
import Sidebar from './components/Sidebar/Sidebar';
import Login from './pages/Login';
import PartMovementAdd from './pages/PartMovementAdd';
import WarehousePart from './pages/WarehousePart';
import PartAdd from './pages/PartAdd';
import PartDetail from './pages/PartDetail';
import DropStock from './pages/DropStock';

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
          <Route path="/PartList" element={<PartList />} />
          <Route path="/PartDetail/:id" element={<PartDetail/>} />
          <Route path="/login" element={<Login />} />
          <Route path='/StockAdd' element={<PartMovementAdd/>} />
          <Route path='/DropStock' element={<DropStock/>}/>
          <Route path='/CreateWarehousePart' element={<WarehousePart/>} />
          <Route path='/CreatePart' element={<PartAdd/>} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
