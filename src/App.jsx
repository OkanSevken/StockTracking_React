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
import WarehouseAdd from './pages/WarehouseAdd';
import Register from './pages/Register';
import LowStockPartsList from './pages/LowStockPartList';

const App = () => {
  const location = useLocation();

  // Giriş ekranında sidebar görünmesin
  const shouldShowSidebar = location.pathname !== '/Login'&& location.pathname !== '/login' && location.pathname !== '/Register';

  return (
    <div className="container">
      {shouldShowSidebar && <Sidebar />}
      <div className="content">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/PartList" element={<PartList />} />
          <Route path="/PartDetail/:id" element={<PartDetail/>} />
          <Route path="/Login" element={<Login />} />
          <Route path='/Register' element={<Register/>}/>
          <Route path='/StockAdd' element={<PartMovementAdd/>} />
          <Route path='/DropStock' element={<DropStock/>}/>
          <Route path='/CreateWarehousePart' element={<WarehousePart/>} />
          <Route path='/CreatePart' element={<PartAdd/>} />
          <Route path='/CreateWarehouse' element={<WarehouseAdd/>}/>
          <Route path='/LowerPartStock' element={<LowStockPartsList/>}/>
        </Routes>
      </div>
    </div>
  );
}

export default App;
