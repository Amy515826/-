import React, { useState, useEffect } from 'react';
import { dataStorage, Credit } from '../services/dataStorage';

const CreditAccounts: React.FC = () => {
  const [records, setRecords] = useState<Credit[]>([]);
  const [newRecord, setNewRecord] = useState<Partial<Credit>>({
    credit_account: '',
    credit_amount: 0,
    is_repaid: false,
    goods_offset: 0,
    funds_offset: 0,
  });

  useEffect(() => {
    setRecords(dataStorage.getCredits());
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setNewRecord({
      ...newRecord,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const credit: Credit = {
      credit_id: dataStorage.generateId(),
      date_time: dataStorage.getCurrentDateTime(),
      credit_account: newRecord.credit_account || '',
      credit_amount: newRecord.credit_amount || 0,
      is_repaid: newRecord.is_repaid || false,
      goods_offset: newRecord.goods_offset || 0,
      funds_offset: newRecord.funds_offset || 0,
    };
    dataStorage.addCredit(credit);
    setRecords(dataStorage.getCredits());
    setNewRecord({ credit_account: '', credit_amount: 0, is_repaid: false, goods_offset: 0, funds_offset: 0 });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">赊账汇总</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex space-x-2">
          <input
            type="text"
            name="credit_account"
            value={newRecord.credit_account}
            onChange={handleInputChange}
            placeholder="赊账账号"
            className="border p-2"
            required
          />
          <input
            type="number"
            name="credit_amount"
            value={newRecord.credit_amount}
            onChange={handleInputChange}
            placeholder="赊账金额"
            className="border p-2"
            required
          />
          <label className="flex items-center">
            <input
              type="checkbox"
              name="is_repaid"
              checked={newRecord.is_repaid}
              onChange={handleInputChange}
              className="mr-2"
            />
            已还款
          </label>
          <input
            type="number"
            name="goods_offset"
            value={newRecord.goods_offset}
            onChange={handleInputChange}
            placeholder="货抵"
            className="border p-2"
          />
          <input
            type="number"
            name="funds_offset"
            value={newRecord.funds_offset}
            onChange={handleInputChange}
            placeholder="款抵"
            className="border p-2"
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
            <th className="border p-2">赊账账号</th>
            <th className="border p-2">赊账金额</th>
            <th className="border p-2">是否还款</th>
            <th className="border p-2">货抵</th>
            <th className="border p-2">款抵</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record.credit_id}>
              <td className="border p-2">{record.date_time}</td>
              <td className="border p-2">{record.credit_account}</td>
              <td className="border p-2">{record.credit_amount}</td>
              <td className="border p-2">{record.is_repaid ? '是' : '否'}</td>
              <td className="border p-2">{record.goods_offset}</td>
              <td className="border p-2">{record.funds_offset}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CreditAccounts;