import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart, Users, CreditCard, DollarSign, Coins, FileText } from 'lucide-react';

const menuItems = [
  { path: '/', icon: BarChart, label: '今日应收状况' },
  { path: '/player-management', icon: Users, label: '玩家账号管理' },
  { path: '/recharge-management', icon: CreditCard, label: '充值管理' },
  { path: '/settlement', icon: FileText, label: '结账系统' },
  { path: '/host-management', icon: DollarSign, label: '主持管理' },
  { path: '/coin-system', icon: Coins, label: '补币系统' },
];

const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <div className="w-64 bg-morandiPurple-200 text-morandiPurple-800">
      <div className="p-4">
        <h1 className="text-2xl font-bold text-morandiPurple-900">开普勒账本</h1>
      </div>
      <nav>
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center p-4 hover:bg-morandiPurple-300 transition-colors ${
              location.pathname === item.path ? 'bg-morandiPurple-300' : ''
            }`}
          >
            <item.icon className="mr-2" size={20} />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;