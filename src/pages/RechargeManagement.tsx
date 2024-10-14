import React, { useState, useEffect } from 'react';
import { dataStorage, Recharge, Player } from '../services/dataStorage';

const RechargeManagement: React.FC = () => {
  const [recharges, setRecharges] = useState<Recharge[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [newRecharge, setNewRecharge] = useState<Partial<Recharge>>({
    player_id: '',
    amount: 0,
    payment_method: '微信',
    receiving_host: '',
  });

  useEffect(() => {
    setRecharges(dataStorage.getRecharges());
    setPlayers(dataStorage.getPlayers());
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewRecharge({ ...newRecharge, [name]: name === 'amount' ? parseFloat(value) : value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const recharge: Recharge = {
      recharge_id: dataStorage.generateId(),
      date_time: dataStorage.getCurrentDateTime(),
      ...newRecharge as Recharge
    };
    dataStorage.addRecharge(recharge);
    setRecharges(dataStorage.getRecharges());

    // Update player's balance
    const player = players.find(p => p.player_id === recharge.player_id);
    if (player) {
      const updatedPlayer = {
        ...player,
        account_balance: player.account_balance + recharge.amount,
        today_recharge_total: player.today_recharge_total + recharge.amount,
        month_recharge_total: player.month_recharge_total + recharge.amount
      };
      dataStorage.updatePlayer(updatedPlayer);
      setPlayers(dataStorage.getPlayers());
    }

    setNewRecharge({
      player_id: '',
      amount: 0,
      payment_method: '微信',
      receiving_host: '',
    });
  };

  return (
    <div className="p-6 bg-morandiPurple-50">
      <h2 className="text-2xl font-bold mb-4 text-morandiPurple-800">充值管理</h2>
      <form onSubmit={handleSubmit} className="mb-4 bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 text-morandiPurple-700">玩家ID：</label>
            <select
              name="player_id"
              value={newRecharge.player_id}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
              required
            >
              <option value="">选择玩家</option>
              {players.map(player => (
                <option key={player.player_id} value={player.player_id}>{player.player_id}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-2 text-morandiPurple-700">充值金额：</label>
            <input
              type="number"
              name="amount"
              value={newRecharge.amount}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-morandiPurple-700">支付方式：</label>
            <select
              name="payment_method"
              value={newRecharge.payment_method}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
              required
            >
              <option value="微信">微信</option>
              <option value="支付宝">支付宝</option>
              <option value="银行转账">银行转账</option>
            </select>
          </div>
          <div>
            <label className="block mb-2 text-morandiPurple-700">收款主持：</label>
            <input
              type="text"
              name="receiving_host"
              value={newRecharge.receiving_host}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>
        </div>
        <button type="submit" className="mt-4 bg-morandiPurple-600 text-white px-4 py-2 rounded hover:bg-morandiPurple-700 transition-colors">
          添加充值记录
        </button>
      </form>
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-morandiPurple-200">
              <th className="border p-2 text-morandiPurple-800">日期时间</th>
              <th className="border p-2 text-morandiPurple-800">玩家ID</th>
              <th className="border p-2 text-morandiPurple-800">充值金额</th>
              <th className="border p-2 text-morandiPurple-800">支付方式</th>
              <th className="border p-2 text-morandiPurple-800">收款主持</th>
            </tr>
          </thead>
          <tbody>
            {recharges.map((recharge) => (
              <tr key={recharge.recharge_id} className="hover:bg-morandiPurple-100">
                <td className="border p-2">{recharge.date_time}</td>
                <td className="border p-2">{recharge.player_id}</td>
                <td className="border p-2">{recharge.amount}</td>
                <td className="border p-2">{recharge.payment_method}</td>
                <td className="border p-2">{recharge.receiving_host}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RechargeManagement;