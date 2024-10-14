import React, { useState, useEffect } from 'react';
import { dataStorage, Player } from '../services/dataStorage';

const PlayerManagement: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [newPlayer, setNewPlayer] = useState<Partial<Player>>({
    player_id: '',
    discount: 1,
    predeposit: 0,
    credit: 0,
    account_balance: 0,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [editingPlayer, setEditingPlayer] = useState<string | null>(null);

  useEffect(() => {
    setPlayers(dataStorage.getPlayers());
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewPlayer({ ...newPlayer, [name]: name === 'player_id' ? value : parseFloat(value) });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPlayer) {
      const updatedPlayer = { ...newPlayer, player_id: editingPlayer } as Player;
      dataStorage.updatePlayer(updatedPlayer);
      setEditingPlayer(null);
    } else {
      const player = newPlayer as Player;
      dataStorage.addPlayer(player);
    }
    setPlayers(dataStorage.getPlayers());
    setNewPlayer({
      player_id: '',
      discount: 1,
      predeposit: 0,
      credit: 0,
      account_balance: 0,
    });
  };

  const handleEdit = (player: Player) => {
    setNewPlayer(player);
    setEditingPlayer(player.player_id);
  };

  const handleDelete = (playerId: string) => {
    dataStorage.deletePlayer(playerId);
    setPlayers(dataStorage.getPlayers());
  };

  const filteredPlayers = players.filter(player =>
    player.player_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-morandiPurple-50">
      <h2 className="text-2xl font-bold mb-4 text-morandiPurple-800">玩家账号管理</h2>
      <form onSubmit={handleSubmit} className="mb-4 bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block mb-2 text-morandiPurple-700">玩家ID：</label>
            <input
              type="text"
              name="player_id"
              value={newPlayer.player_id}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
              required
              disabled={!!editingPlayer}
            />
          </div>
          <div>
            <label className="block mb-2 text-morandiPurple-700">折扣：</label>
            <input
              type="number"
              name="discount"
              value={newPlayer.discount}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
              step="0.01"
              min="0"
              max="1"
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-morandiPurple-700">预存：</label>
            <input
              type="number"
              name="predeposit"
              value={newPlayer.predeposit}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-morandiPurple-700">赊账：</label>
            <input
              type="number"
              name="credit"
              value={newPlayer.credit}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>
        </div>
        <button type="submit" className="mt-4 bg-morandiPurple-600 text-white px-4 py-2 rounded hover:bg-morandiPurple-700 transition-colors">
          {editingPlayer ? '更新玩家' : '添加玩家'}
        </button>
      </form>
      <div className="mb-4">
        <input
          type="text"
          placeholder="搜索玩家ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-morandiPurple-200">
              <th className="border p-2 text-morandiPurple-800">玩家ID</th>
              <th className="border p-2 text-morandiPurple-800">折扣</th>
              <th className="border p-2 text-morandiPurple-800">预存</th>
              <th className="border p-2 text-morandiPurple-800">赊账</th>
              <th className="border p-2 text-morandiPurple-800">账号余额</th>
              <th className="border p-2 text-morandiPurple-800">操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredPlayers.map((player) => (
              <tr key={player.player_id} className="hover:bg-morandiPurple-100">
                <td className="border p-2">{player.player_id}</td>
                <td className="border p-2">{player.discount}</td>
                <td className="border p-2">{player.predeposit}</td>
                <td className="border p-2">{player.credit}</td>
                <td className="border p-2">{player.account_balance}</td>
                <td className="border p-2">
                  <button
                    onClick={() => handleEdit(player)}
                    className="bg-morandiPurple-500 text-white px-2 py-1 rounded mr-2 hover:bg-morandiPurple-600 transition-colors"
                  >
                    编辑
                  </button>
                  <button
                    onClick={() => handleDelete(player.player_id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors"
                  >
                    删除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PlayerManagement;