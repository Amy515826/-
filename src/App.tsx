import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import DailyRevenue from './pages/DailyRevenue';
import PlayerManagement from './pages/PlayerManagement';
import RechargeManagement from './pages/RechargeManagement';
import Settlement from './pages/Settlement';
import HostManagement from './pages/HostManagement';
import CoinSystem from './pages/CoinSystem';

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex h-screen bg-morandiPurple-100">
        <Sidebar />
        <div className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<DailyRevenue />} />
            <Route path="/player-management" element={<PlayerManagement />} />
            <Route path="/recharge-management" element={<RechargeManagement />} />
            <Route path="/settlement" element={<Settlement />} />
            <Route path="/host-management" element={<HostManagement />} />
            <Route path="/coin-system" element={<CoinSystem />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;