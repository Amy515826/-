import React, { useState, useEffect } from 'react';
import { dataStorage, Player } from '../services/dataStorage';

const PlayerAccounts: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [newPlayer, setNewPlayer] = useState<Partial<Player>>({
    player_id: '',
    discount: 1,
    predeposit: 0,
    today_recharge_total: 0,
    month_recharge_total: 0,
    account_balance: 0,
  });

  useEffect(() => {
    setPlayers(dataStorage.getPlayers());
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewPlayer({ ...newPlayer, [name]: name === 'player_id' ? value : parseFloat(value) });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const player = {
      ...newPlayer,
      account_balance: (newPlayer.predeposit || 0) + (newPlayer.today_recharge_total || 0),
    } as Player;
    dataStorage.addPlayer(player);
    setPlayers(dataStorage.getPlayers());
    setNewPlayer({
      player_id: '',
      discount: 1,
      predeposit: 0,
      today_recharge_total: 0,
      month_recharge_total: 0,
      account_balance: 0,
    });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">玩家账号汇总</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex space-x-2">
          <input
            type="text"
            name="player_id"
            value={newPlayer.player_id}
            onChange={handleInputChange}
            placeholder="玩家ID"
            className="border p-2"
            required
          />
          <input
            type="number"
            name="discount"
            value={newPlayer.discount}
            onChange={handleInputChange}
            placeholder="折扣"
            className="border p-2"
            step="0.01"
            min="0"
            max="1"
            required
          />
          <input
            type="number"
            name="predeposit"
            value={newPlayer.predeposit}
            onChange={handleInputChange}
            placeholder="预存"
            className="border p-2"
            required
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            添加玩家
          </button>
        </div>
      </form>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">ID</th>
            <th className="border p-2">折扣</th>
            <th className="border p-2">预存</th>
            <th className="border p-2">今日累计充值</th>
            <th className="border p-2">本月累计充值</th>
            <th className="border p-2">账号余额</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player) => (
            <tr key={player.player_id}>
              <td className="border p-2">{player.player_id}</td>
              <td className="border p-2">{player.discount}</td>
              <td className="border p-2">{player.predeposit}</td>
              <td className="border p-2">{player.today_recharge_total}</td>
              <td className="border p-2">{player.month_recharge_total}</td>
              <td className="border p-2">{player.account_balance}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PlayerAccounts;