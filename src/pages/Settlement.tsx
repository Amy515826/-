import React, { useState, useEffect } from 'react';
import { dataStorage, Player, Settlement, Host } from '../services/dataStorage';

const SettlementPage: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [hosts, setHosts] = useState<Host[]>([]);
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [newSettlement, setNewSettlement] = useState<Partial<Settlement>>({
    player_id: '',
    gift_value: 0,
    host_id: '',
  });
  const [transferToPredeposit, setTransferToPredeposit] = useState(false);
  const [transferAmount, setTransferAmount] = useState(0);

  useEffect(() => {
    setPlayers(dataStorage.getPlayers());
    setHosts(dataStorage.getHosts());
    setSettlements(dataStorage.getSettlements());
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'transferToPredeposit') {
      setTransferToPredeposit(e.target.checked);
    } else if (name === 'transferAmount') {
      setTransferAmount(parseFloat(value));
    } else {
      setNewSettlement({ ...newSettlement, [name]: name === 'gift_value' ? parseFloat(value) : value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const player = players.find(p => p.player_id === newSettlement.player_id);
    const host = hosts.find(h => h.host_id === newSettlement.host_id);
    if (!player || !host) return;

    const playerSettlement = (newSettlement.gift_value || 0) / 10 * player.discount;
    const hostSettlement = (newSettlement.gift_value || 0) / 10 * host.discount;
    const profit = hostSettlement - playerSettlement;

    const settlement: Settlement = {
      settlement_id: dataStorage.generateId(),
      date_time: dataStorage.getCurrentDateTime(),
      ...newSettlement,
      player_settlement: playerSettlement,
      host_settlement: hostSettlement,
      profit: profit,
      transfer_to_predeposit: transferToPredeposit,
      transfer_amount: transferToPredeposit ? transferAmount : 0,
    } as Settlement;

    dataStorage.addSettlement(settlement);

    // Update player's account
    if (transferToPredeposit) {
      player.predeposit += transferAmount;
      player.account_balance -= playerSettlement - transferAmount;
    } else {
      player.account_balance -= playerSettlement;
    }
    dataStorage.updatePlayer(player);

    // Update host's gift value balance
    host.gift_value_balance = (host.gift_value_balance || 0) + (newSettlement.gift_value || 0);
    dataStorage.updateHost(host);

    setSettlements(dataStorage.getSettlements());
    setPlayers(dataStorage.getPlayers());
    setHosts(dataStorage.getHosts());
    setNewSettlement({
      player_id: '',
      gift_value: 0,
      host_id: '',
    });
    setTransferToPredeposit(false);
    setTransferAmount(0);
  };

  // Calculate totals
  const totalGiftValue = settlements.reduce((sum, settlement) => sum + settlement.gift_value, 0);
  const totalPlayerSettlement = settlements.reduce((sum, settlement) => sum + settlement.player_settlement, 0);
  const totalHostSettlement = settlements.reduce((sum, settlement) => sum + settlement.host_settlement, 0);
  const totalProfit = settlements.reduce((sum, settlement) => sum + settlement.profit, 0);

  return (
    <div className="p-6 bg-morandiPurple-50">
      <h2 className="text-2xl font-bold mb-4 text-morandiPurple-800">结账系统</h2>
      <form onSubmit={handleSubmit} className="mb-4 bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 text-morandiPurple-700">玩家ID：</label>
            <select
              name="player_id"
              value={newSettlement.player_id}
              onChange={handleInputChange}
              className="w-full border p-2 rounded bg-morandiPurple-100"
              required
            >
              <option value="">选择玩家</option>
              {players.map(player => (
                <option key={player.player_id} value={player.player_id}>{player.player_id}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-2 text-morandiPurple-700">礼物值：</label>
            <input
              type="number"
              name="gift_value"
              value={newSettlement.gift_value}
              onChange={handleInputChange}
              className="w-full border p-2 rounded bg-morandiPurple-100"
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-morandiPurple-700">主持ID：</label>
            <select
              name="host_id"
              value={newSettlement.host_id}
              onChange={handleInputChange}
              className="w-full border p-2 rounded bg-morandiPurple-100"
              required
            >
              <option value="">选择主持</option>
              {hosts.map(host => (
                <option key={host.host_id} value={host.host_id}>{host.host_id}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="transferToPredeposit"
              checked={transferToPredeposit}
              onChange={handleInputChange}
              className="mr-2"
            />
            <span className="text-morandiPurple-700">转入预存</span>
          </label>
        </div>
        {transferToPredeposit && (
          <div className="mt-2">
            <label className="block mb-2 text-morandiPurple-700">转入金额：</label>
            <input
              type="number"
              name="transferAmount"
              value={transferAmount}
              onChange={handleInputChange}
              className="w-full border p-2 rounded bg-morandiPurple-100"
              required
            />
          </div>
        )}
        <button type="submit" className="mt-4 bg-morandiPurple-600 text-white px-4 py-2 rounded hover:bg-morandiPurple-700 transition-colors">
          添加结账记录
        </button>
      </form>
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-morandiPurple-200">
              <th className="border p-2 text-left text-morandiPurple-800">日期</th>
              <th className="border p-2 text-left text-morandiPurple-800">玩家ID</th>
              <th className="border p-2 text-left text-morandiPurple-800">礼物值</th>
              <th className="border p-2 text-left text-morandiPurple-800">跟玩家结账</th>
              <th className="border p-2 text-left text-morandiPurple-800">跟币商结账</th>
              <th className="border p-2 text-left text-morandiPurple-800">本单盈利</th>
              <th className="border p-2 text-left text-morandiPurple-800">转入预存</th>
            </tr>
          </thead>
          <tbody>
            {settlements.map((settlement) => (
              <tr key={settlement.settlement_id} className="hover:bg-morandiPurple-100">
                <td className="border p-2 text-morandiPurple-700">{settlement.date_time}</td>
                <td className="border p-2 text-morandiPurple-700">{settlement.player_id}</td>
                <td className="border p-2 text-morandiPurple-700">{settlement.gift_value}</td>
                <td className="border p-2 text-morandiPurple-700">{settlement.player_settlement?.toFixed(2)}</td>
                <td className="border p-2 text-morandiPurple-700">{settlement.host_settlement?.toFixed(2)}</td>
                <td className="border p-2 text-morandiPurple-700">{settlement.profit?.toFixed(2)}</td>
                <td className="border p-2 text-morandiPurple-700">{settlement.transfer_to_predeposit ? '是' : '否'}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-morandiPurple-300 font-bold">
              <td colSpan={2} className="border p-2 text-morandiPurple-800">合计</td>
              <td className="border p-2 text-morandiPurple-800">{totalGiftValue.toFixed(2)}</td>
              <td className="border p-2 text-morandiPurple-800">{totalPlayerSettlement.toFixed(2)}</td>
              <td className="border p-2 text-morandiPurple-800">{totalHostSettlement.toFixed(2)}</td>
              <td className="border p-2 text-morandiPurple-800">{totalProfit.toFixed(2)}</td>
              <td className="border p-2"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default SettlementPage;