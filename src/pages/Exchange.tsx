import React, { useState, useEffect } from 'react';
import { dataStorage, Exchange } from '../services/dataStorage';

const ExchangePage: React.FC = () => {
  const [records, setRecords] = useState<Exchange[]>([]);
  const [newRecord, setNewRecord] = useState<Partial<Exchange>>({
    exchange_account: '',
    quantity: 0,
    discount: 1,
  });

  useEffect(() => {
    setRecords(dataStorage.getExchanges());
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewRecord({ ...newRecord, [name]: name === 'exchange_account' ? value : parseFloat(value) });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const exchange: Exchange = {
      exchange_id: dataStorage.generateId(),
      date_time: dataStorage.getCurrentDateTime(),
      exchange_account: newRecord.exchange_account || '',
      quantity: newRecord.quantity || 0,
      discount: newRecord.discount || 1,
      today_exchange_total: (records[records.length - 1]?.today_exchange_total || 0) + (newRecord.quantity || 0),
    };
    dataStorage.addExchange(exchange);
    setRecords(dataStorage.getExchanges());
    setNewRecord({ exchange_account: '', quantity: 0, discount: 1 });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">换冲汇总</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex space-x-2">
          <input
            type="text"
            name="exchange_account"
            value={newRecord.exchange_account}
            onChange={handleInputChange}
            placeholder="换冲账号"
            className="border p-2"
            required
          />
          <input
            type="number"
            name="quantity"
            value={newRecord.quantity}
            onChange={handleInputChange}
            placeholder="换冲货量"
            className="border p-2"
            required
          />
          <input
            type="number"
            name="discount"
            value={newRecord.discount}
            onChange={handleInputChange}
            placeholder="折扣"
            className="border p-2"
            step="0.01"
            min="0"
            max="1"
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
            <th className="border p-2">换冲账号</th>
            <th className="border p-2">换冲货量</th>
            <th className="border p-2">折扣</th>
            <th className="border p-2">今日累计换冲</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record.exchange_id}>
              <td className="border p-2">{record.date_time}</td>
              <td className="border p-2">{record.exchange_account}</td>
              <td className="border p-2">{record.quantity}</td>
              <td className="border p-2">{record.discount}</td>
              <td className="border p-2">{record.today_exchange_total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExchangePage;