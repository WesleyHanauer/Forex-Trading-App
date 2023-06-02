import { useEffect, useState } from 'react';
import { Table } from '@mantine/core';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

interface Trade {
  id: number;
  currencyPair: string;
  volume: number;
  type: string;
  price: number;
  value: number;
  timestamp: string;
}

const Trades = () => {
  const [trades, setTrades] = useState<Trade[]>([]);

  useEffect(() => {
    const fetchTrades = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/trades/${localStorage.getItem('token')}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch trades');
        }

        const data = await response.json();
        setTrades(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTrades();
  }, []);

  return (
    <div>
      <h1>Past Trades</h1>
      <Link to="/dashboard">Dashboard</Link>
      <Table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Currency Pair</th>
            <th>Volume</th>
            <th>Type</th>
            <th>Price</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
        {trades
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .map((trade) => (
            <tr key={trade.id}>
              <td>{format(new Date(trade.timestamp), 'MM/dd/yyyy HH:mm:ss')}</td>
              <td>{trade.currencyPair}</td>
              <td>{trade.volume}</td>
              <td>{trade.type}</td>
              <td>{trade.price}</td>
              <td>{trade.value}</td>
            </tr>
          ))}
      </tbody>
      </Table>
    </div>
  );
};

export default Trades;