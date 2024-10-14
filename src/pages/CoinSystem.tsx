import React, { useState, useEffect } from 'react';
import { dataStorage, CoinReplenishment, Host } from '../services/dataStorage';

const CoinSystem: React.FC = () => {
  const [replenishments, setReplenishments] = useState<CoinReplenishment[]>([]);
  const [hosts, setHosts] = useState<Host[]>([]);
  const [newReplenishment, setNewReplenishment] = useState<Partial<CoinReplenishment>>({
    replenishment_time: new Date().toISOString().slice(0, 16),
    replenishment_amount: 0,
    remaining_coins: 0,
    replenishment_account: ''
  });

  useEffect(() => {
    const fetchData = () => {
      const coinReplenishments = dataStorage.getCoinReplenishments();
      setReplenishments(coinReplenishments || []);
      setHosts(dataStorage.getHosts());
    };

    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewReplenishment({ ...newReplenishment, [name]: name === 'replenishment_amount' || name === 'remaining_coins' ? parseFloat(value) : value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const replenishment: CoinReplenishment = {
      ...newReplenishment as CoinReplenishment,
      replenishment_id: dataStorage.generateId(),
      replenishment_time: new Date().toISOString()
    };
    dataStorage.addCoinReplenishment(replenishment);
    setReplenishments([...replenishments, replenishment]);
    setNewReplenishment({
      replenishment_time: new Date().toISOString().slice(0, 16),
      replenishment_amount: 0,
      remaining_coins: 0,
      replenishment_account: ''
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">补币系统</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-2">
          <label className="block">补币金额：</label>
          <input
            type="number"
            name="replenishment_amount"
            value={newReplenishment.replenishment_amount}
            onChange={handleInputChange}
            className="border p-1"
            required
          />
        </div>
        <div className="mb-2">
          <label className="block">余币：</label>
          <input
            type="number"
            name="remaining_coins"
            value={newReplenishment.remaining_coins}
            onChange={handleInputChange}
            className="border p-1"
            required
          />
        </div>
        <div className="mb-2">
          <label className="block">账号类型：</label>
          <select
            name="replenishment_account"
            value={newReplenishment.replenishment_account}
            onChange={handleInputChange}
            className="border p-1"
            required
          >
            <option value="">选择账号</option>
            {hosts.map((host) => (
              <option key={host.host_id} value={host.host_id}>
                {host.host_id} ({host.host_type === 'recharge' ? '充值号' : host.host_type === 'host' ? '主持号' : '房主号'})
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          添加补币记录
        </button>
      </form>
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">补币时间</th>
            <th className="border p-2">补币金额</th>
            <th className="border p-2">余币</th>
            <th className="border p-2">账号</th>
          </tr>
        </thead>
        <tbody>
          {replenishments.map((replenishment) => (
            <tr key={replenishment.replenishment_id}>
              <td className="border p-2">{new Date(replenishment.replenishment_time).toLocaleString()}</td>
              <td className="border p-2">{replenishment.replenishment_amount}</td>
              <td className="border p-2">{replenishment.remaining_coins}</td>
              <td className="border p-2">{replenishment.replenishment_account}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CoinSystem;