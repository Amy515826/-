import React, { useState, useEffect } from 'react';
import { dataStorage, Host, HostIncome, Settlement } from '../services/dataStorage';

const HostManagement: React.FC = () => {
  const [hosts, setHosts] = useState<Host[]>([]);
  const [hostIncomes, setHostIncomes] = useState<HostIncome[]>([]);
  const [newHost, setNewHost] = useState<Partial<Host>>({
    host_id: '',
    host_type: 'host',
    discount: 1,
    gift_value_balance: 0,
  });
  const [newIncome, setNewIncome] = useState<Partial<HostIncome>>({
    host_id: '',
    work_time_period: '',
    gift_value: 0,
  });

  useEffect(() => {
    setHosts(dataStorage.getHosts());
    setHostIncomes(dataStorage.getHostIncomes());
  }, []);

  const handleHostInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewHost({ ...newHost, [name]: name === 'host_id' || name === 'host_type' ? value : parseFloat(value) });
  };

  const handleIncomeInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewIncome({ ...newIncome, [name]: name === 'gift_value' ? parseFloat(value) : value });
  };

  const handleHostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const host = newHost as Host;
    dataStorage.addHost(host);
    setHosts(dataStorage.getHosts());
    setNewHost({ host_id: '', host_type: 'host', discount: 1, gift_value_balance: 0 });
  };

  const handleIncomeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const host = hosts.find(h => h.host_id === newIncome.host_id);
    if (!host || host.host_type !== 'host') return;

    const hostIncome: HostIncome = {
      income_id: dataStorage.generateId(),
      date_time: dataStorage.getCurrentDateTime(),
      ...newIncome,
      income: (newIncome.gift_value || 0) / 10 * host.discount,
    } as HostIncome;

    dataStorage.addHostIncome(hostIncome);
    setHostIncomes(dataStorage.getHostIncomes());
    setNewIncome({ host_id: '', work_time_period: '', gift_value: 0 });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">主持管理</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-xl font-semibold mb-2">添加账号</h3>
          <form onSubmit={handleHostSubmit} className="mb-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2">账号：</label>
                <input
                  type="text"
                  name="host_id"
                  value={newHost.host_id}
                  onChange={handleHostInputChange}
                  className="w-full border p-2"
                  required
                />
              </div>
              <div>
                <label className="block mb-2">账号类型：</label>
                <select
                  name="host_type"
                  value={newHost.host_type}
                  onChange={handleHostInputChange}
                  className="w-full border p-2"
                  required
                >
                  <option value="recharge">充值号</option>
                  <option value="host">主持号</option>
                  <option value="owner">房主号</option>
                </select>
              </div>
              <div>
                <label className="block mb-2">折扣：</label>
                <input
                  type="number"
                  name="discount"
                  value={newHost.discount}
                  onChange={handleHostInputChange}
                  className="w-full border p-2"
                  step="0.01"
                  min="0"
                  max="1"
                  required
                />
              </div>
              {(newHost.host_type === 'recharge' || newHost.host_type === 'owner') && (
                <div>
                  <label className="block mb-2">礼物值余额：</label>
                  <input
                    type="number"
                    name="gift_value_balance"
                    value={newHost.gift_value_balance}
                    onChange={handleHostInputChange}
                    className="w-full border p-2"
                    required
                  />
                </div>
              )}
            </div>
            <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
              添加账号
            </button>
          </form>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">记录主持收益</h3>
          <form onSubmit={handleIncomeSubmit} className="mb-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2">主持账号：</label>
                <select
                  name="host_id"
                  value={newIncome.host_id}
                  onChange={handleIncomeInputChange}
                  className="w-full border p-2"
                  required
                >
                  <option value="">选择主持</option>
                  {hosts.filter(host => host.host_type === 'host').map(host => (
                    <option key={host.host_id} value={host.host_id}>{host.host_id}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-2">工作时间段：</label>
                <input
                  type="text"
                  name="work_time_period"
                  value={newIncome.work_time_period}
                  onChange={handleIncomeInputChange}
                  className="w-full border p-2"
                  placeholder="例：10:00-18:00"
                  required
                />
              </div>
              <div>
                <label className="block mb-2">礼物值：</label>
                <input
                  type="number"
                  name="gift_value"
                  value={newIncome.gift_value}
                  onChange={handleIncomeInputChange}
                  className="w-full border p-2"
                  required
                />
              </div>
            </div>
            <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
              记录收益
            </button>
          </form>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-8">
        <div>
          <h3 className="text-xl font-semibold mb-2">账号列表</h3>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">账号</th>
                <th className="border p-2">类型</th>
                <th className="border p-2">折扣</th>
                <th className="border p-2">礼物值余额</th>
              </tr>
            </thead>
            <tbody>
              {hosts.map((host, index) => (
                <tr key={index}>
                  <td className="border p-2">{host.host_id}</td>
                  <td className="border p-2">{host.host_type === 'recharge' ? '充值号' : host.host_type === 'host' ? '主持号' : '房主号'}</td>
                  <td className="border p-2">{host.discount}</td>
                  <td className="border p-2">{host.gift_value_balance || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">主持收益记录</h3>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">日期</th>
                <th className="border p-2">主持账号</th>
                <th className="border p-2">工作时间段</th>
                <th className="border p-2">礼物值</th>
                <th className="border p-2">收益</th>
              </tr>
            </thead>
            <tbody>
              {hostIncomes.map((income, index) => (
                <tr key={index}>
                  <td className="border p-2">{income.date_time}</td>
                  <td className="border p-2">{income.host_id}</td>
                  <td className="border p-2">{income.work_time_period}</td>
                  <td className="border p-2">{income.gift_value}</td>
                  <td className="border p-2">{income.income}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HostManagement;