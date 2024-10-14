import React, { useState, useEffect } from 'react';
import { dataStorage, HostIncome } from '../services/dataStorage';

const HostEarnings: React.FC = () => {
  const [earnings, setEarnings] = useState<HostIncome[]>([]);
  const [newEarning, setNewEarning] = useState<Partial<HostIncome>>({
    host_id: '',
    work_time_period: '',
    quantity: 0,
    other_income: 0,
  });

  useEffect(() => {
    setEarnings(dataStorage.getHostIncomes());
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewEarning({ ...newEarning, [name]: name === 'host_id' || name === 'work_time_period' ? value : parseFloat(value) });
  };

  const calculateDailyEarnings = (quantity: number, otherIncome: number) => {
    // 这里可以根据实际情况调整计算逻辑
    const quantityEarnings = quantity * 0.0001; // 假设每1000货量获得0.1的收益
    return quantityEarnings + otherIncome;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dailyEarnings = calculateDailyEarnings(newEarning.quantity || 0, newEarning.other_income || 0);
    const hostIncome: HostIncome = {
      host_id: newEarning.host_id || '',
      work_time_period: newEarning.work_time_period || '',
      quantity: newEarning.quantity || 0,
      other_income: newEarning.other_income || 0,
      daily_income: dailyEarnings,
    };
    dataStorage.addHostIncome(hostIncome);
    setEarnings(dataStorage.getHostIncomes());
    setNewEarning({ host_id: '', work_time_period: '', quantity: 0, other_income: 0 });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">主持收益</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex space-x-2">
          <input
            type="text"
            name="host_id"
            value={newEarning.host_id}
            onChange={handleInputChange}
            placeholder="主持账号"
            className="border p-2"
            required
          />
          <input
            type="text"
            name="work_time_period"
            value={newEarning.work_time_period}
            onChange={handleInputChange}
            placeholder="工作时间段 (如: 10:00-18:00)"
            className="border p-2"
            required
          />
          <input
            type="number"
            name="quantity"
            value={newEarning.quantity}
            onChange={handleInputChange}
            placeholder="货量"
            className="border p-2"
            required
          />
          <input
            type="number"
            name="other_income"
            value={newEarning.other_income}
            onChange={handleInputChange}
            placeholder="其他收益"
            className="border p-2"
            required
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            添加记录
          </button>
        </div>
      </form>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">主持账号</th>
            <th className="border p-2">工作时间段</th>
            <th className="border p-2">货量</th>
            <th className="border p-2">其他收益</th>
            <th className="border p-2">本日收益</th>
          </tr>
        </thead>
        <tbody>
          {earnings.map((earning, index) => (
            <tr key={index}>
              <td className="border p-2">{earning.host_id}</td>
              <td className="border p-2">{earning.work_time_period}</td>
              <td className="border p-2">{earning.quantity}</td>
              <td className="border p-2">{earning.other_income}</td>
              <td className="border p-2">{earning.daily_income.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HostEarnings;