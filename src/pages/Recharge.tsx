import React, { useState, useEffect } from 'react';
import { dataStorage, Recharge as RechargeType, Player } from '../services/dataStorage';

const RechargePage: React.FC = () => {
  const [recharges, setRecharges] = useState<RechargeType[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [newRecharge, setNewRecharge] = useState<Partial<RechargeType>>({
    player_id: '',
    payment_method: '微信',
    receiving_host: '',
    amount: 0,
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
    const recharge: RechargeType = {
      recharge_id: dataStorage.generateId(),
      date_time: dataStorage.getCurrentDateTime(),
      ...newRecharge,
    } as RechargeType;
    dataStorage.addRecharge(recharge);

    // Update player's recharge totals and balance
    const player = players.find(p => p.player_id === recharge.player_id);
    if (player) {
      player.today_recharge_total += recharge.amount;
      player.month_recharge_total += recharge.amount;
      player.account_balance += recharge.amount;
      dataStorage.updatePlayer(player);
    }

    setRecharges(dataStorage.getRecharges());
    setPlayers(dataStorage.getPlayers());
    setNewRecharge({
      player_id: '',
      payment_method: '微信',
      receiving_host: '',
      amount: 0,
    });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">充值汇总</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex space-x-2">
          <select
            name="player_id"
            value={newRecharge.player_id}
            onChange={handleInputChange}
            className="border p-2"
            required
          >
            <option value="">选择玩家</option>
            {players.map(player => (
              <option key={player.player_id} value={player.player_id}>{player.player_id}</option>
            ))}
          </select>
          <select
            name="payment_method"
            value={newRecharge.payment_method}
            onChange={handleInputChange}
            className="border p-2"
          >
            <option value="微信">微信</option>
            <option value="支付宝">支付宝</option>
            <option value="银行转账">银行转账</option>
          </select>
          <input
            type="text"
            name="receiving_host"
            value={newRecharge.receiving_host}
            onChange={handleInputChange}
            placeholder="收款主持"
            className="border p-2"
            required
          />
          <input
            type="number"
            name="amount"
            value={newRecharge.amount}
            onChange={handleInputChange}
            placeholder="充值金额"
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
            <th className="border p-2">日期</th>
            <th className="border p-2">充值账号ID</th>
            <th className="border p-2">支付方式</th>
            <th className="border p-2">收款主持</th>
            <th className="border p-2">充值金额</th>
          </tr>
        </thead>
        <tbody>
          {recharges.map((recharge) => (
            <tr key={recharge.recharge_id}>
              <td className="border p-2">{recharge.date_time}</td>
              <td className="border p-2">{recharge.player_id}</td>
              <td className="border p-2">{recharge.payment_method}</td>
              <td className="border p-2">{recharge.receiving_host}</td>
              <td className="border p-2">{recharge.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RechargePage;