import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { dataStorage } from '../services/dataStorage';

const DailyRevenue: React.FC = () => {
  const [hourlyData, setHourlyData] = useState<{ hour: string; giftValue: number }[]>([]);

  useEffect(() => {
    const data = dataStorage.getDailyRevenueData();
    setHourlyData(data);
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">今日应收状况</h2>
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">24小时结账礼物值汇总表格</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">时间</th>
              <th className="border p-2">礼物值</th>
            </tr>
          </thead>
          <tbody>
            {hourlyData.map((item) => (
              <tr key={item.hour}>
                <td className="border p-2">{item.hour}</td>
                <td className="border p-2">{item.giftValue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="h-96">
        <h3 className="text-xl font-semibold mb-2">24小时结账礼物值曲线图</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={hourlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="giftValue" stroke="#8884d8" name="礼物值" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DailyRevenue;