import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Input,
  Button,
  Paper,
  Text
} from '@mantine/core';

const Dashboard = () => {
  const [gbpUsdRate, setGbpUsdRate] = useState<number | null>(null);
  const [usdGbpRate, setUsdGbpRate] = useState<number | null>(null);
  const [volumeGbpUsd, setVolumeGbpUsd] = useState<number | null>(null);
  const [volumeUsdGbp, setVolumeUsdGbp] = useState<number | null>(null);
  const [isBuyGbpUsd, setIsBuyGbpUsd] = useState<boolean>(true);
  const [isBuyUsdGbp, setIsBuyUsdGbp] = useState<boolean>(true);
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
  const [usdBalance, setUsdBalance] = useState<number | null>(null);
  const [gbpBalance, setGbpBalance] = useState<number | null>(null);

  const fetchBalances = async () => {
    try {
      const balanceResponse = await fetch(
        `http://localhost:8080/api/users/${localStorage.getItem('token')}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      const userData = await balanceResponse.json();
      const usdBalance = userData.data.balances[0].amount;
      const gbpBalance = userData.data.balances[1].amount;

      setUsdBalance(usdBalance);
      setGbpBalance(gbpBalance);

      console.log('API call successful. USD Balance:', usdBalance, 'GBP Balance:', gbpBalance);
    } catch (error) {
      console.error('Error fetching balances:', error);
    }
  };

  useEffect(() => {
    fetchBalances();

    const ws = new WebSocket('ws://localhost:5000');

      ws.onopen = () => {
        console.log('WebSocket connection established.');
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
  
        if (data.type === 'trade') {
          const { s, p } = data.data[0];
  
          if (s === 'OANDA:GBP_USD') {
            const rate = 1 / p;
            setGbpUsdRate(Number(rate.toFixed(6)));
            if (usdGbpRate === null) {
              setUsdGbpRate(Number((1 / rate).toFixed(6)));
            }
          } else {
            const rate = p;
            setUsdGbpRate(Number(rate.toFixed(6)));
            if (gbpUsdRate === null) {
              setGbpUsdRate(Number((1 / rate).toFixed(6)));
            }
          }
        }
      };
      
      ws.onclose = () => {
        console.log('WebSocket connection closed.');
      };

      return () => {
        ws.close();
      };
  }, []);

  const handleConfirmClick = async (
    volume: number | null,
    isBuy: boolean,
    rate: number | null,
    currencyPair: string
  ) => {
    if (rate === null || volume === null) {
      return;
    }
  
    const tradeValue = isBuy ? volume * rate : volume / rate;
    const tradeType = isBuy ? 'buy' : 'sell';
    const tradeTimestamp = new Date().toISOString();
  
    try {
      const response = await fetch('http://localhost:8080/api/trades', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          userId: localStorage.getItem('userId'),
          currencyPair,
          volume,
          price: rate,
          value: tradeValue,
          type: tradeType,
          timestamp: tradeTimestamp,
        }),
      });
  
      if (response.ok) {
        console.log('Trade created successfully.');
  
        const balanceResponse = await fetch(`http://localhost:8080/api/users/${localStorage.getItem('token')}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });

        const userData = await balanceResponse.json();
        const usdBalance = userData.data.balances[0].amount;
        const gbpBalance = userData.data.balances[1].amount;        

        if (currencyPair === 'GBP/USD') {
          const tradeNotionalValue = Math.abs(tradeValue * rate);
  
          if (isBuy && gbpBalance < tradeNotionalValue) {
            console.log('Insufficient funds in GBP balance');
            return;
          }
          if (!isBuy && gbpBalance < volume) {
            console.log('Insufficient funds in GBP balance');
            return;
          }
          fetchBalances();
          
  
          const newUsdBalance = isBuy ? usdBalance + tradeValue : usdBalance - tradeValue;
          const newGbpBalance = isBuy ? gbpBalance - tradeNotionalValue : gbpBalance + tradeNotionalValue;
  
          const updateResponse = await fetch(`http://localhost:8080/api/users/${localStorage.getItem('token')}/balance`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({
              balances: [
                { currency: 'USD', amount: newUsdBalance },
                { currency: 'GBP', amount: newGbpBalance }
              ]
            }),
          });
  
          if (updateResponse.ok) {
            await fetchBalances();
            console.log(`User's balances updated successfully.`);
          } else {
            throw new Error(`Failed to update user's balances: ${updateResponse.status} ${updateResponse.statusText}`);
          }
        } else if (currencyPair === 'USD/GBP') {
          const tradeNotionalValue = Math.abs(volume * rate);
  
          if (isBuy && usdBalance < tradeNotionalValue) {
            console.log('Insufficient funds in USD balance');
            return;
          }
          if (!isBuy && usdBalance < tradeNotionalValue) {
            console.log('Insufficient funds in USD balance');
            return;
          }
          fetchBalances();

          const newUsdBalance = isBuy ? usdBalance - tradeNotionalValue : usdBalance + tradeNotionalValue;
          const newGbpBalance = isBuy ? gbpBalance + volume : gbpBalance - volume;
  
          const updateResponse = await fetch(`http://localhost:8080/api/users/${localStorage.getItem('userId')}/balance`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({
              balances: [
                { currency: 'USD', amount: newUsdBalance },
                { currency: 'GBP', amount: newGbpBalance },          
              ],
            }),
          });
  
          if (updateResponse.ok) {
            await fetchBalances();
            console.log(`User's balances updated successfully.`);
          } else {
            throw new Error(`Failed to update user's balances: ${updateResponse.status} ${updateResponse.statusText}`);
          }
        }
      } else {
        throw new Error(`Failed to create trade: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error(`An error occurred while creating or updating trade: ${error}`);
    }
  };

  const handleVolumeGbpUsdChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = Number(event.target.value);
    setVolumeGbpUsd(isNaN(value) ? null : value);
  };

  const handleVolumeUsdGbpChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = Number(event.target.value);
    setVolumeUsdGbp(isNaN(value) ? null : value);
  };

  const handleBuySellChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.currentTarget.value;
    const isBuy = value === 'buy';
    setIsBuyGbpUsd(isBuy);
    setIsBuyUsdGbp(isBuy);
  };

  const renderConversionForm = (
    rate: number | null,
    isGbpUsd: boolean,
    volume: number | null,
    isBuy: boolean,
    handleVolumeChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
    handleBuySellChange: (event: React.ChangeEvent<HTMLSelectElement>) => void,
    currencyPair: string
  ) => {
    return (
      <Paper shadow="sm" style={{ marginBottom: '16px' }}>
        {isGbpUsd && (
          <div style={{ marginBottom: '20px' }}>
            <center>
            <Text size="xl">USD Balance: {usdBalance !== null ? usdBalance.toFixed(2) : 'Loading...'}</Text>
            <Text size="xl">GBP Balance: {gbpBalance !== null ? gbpBalance.toFixed(2) : 'Loading...'}</Text>
            </center>
          </div>
        )}
        <Text weight={500} style={{ marginBottom: '16px' }}>{currencyPair}</Text>
        {rate !== null ? (
          <Text size="sm">{currencyPair} rate: {rate}</Text>
        ) : (
          <Text size="sm">Loading {currencyPair} rate...</Text>
        )}
        <div style={{ marginTop: '16px' }}>
          <Input
            type="number"
            placeholder="0"
            value={volume !== null ? volume : ''}
            onChange={handleVolumeChange}
            style={{ marginBottom: '8px' }}
          />
          <label>
            Buy/Sell:
            <select value={isBuy ? 'buy' : 'sell'} onChange={handleBuySellChange}>
              <option value="buy">Buy</option>
              <option value="sell">Sell</option>
            </select>
          </label>
          <Button onClick={() => handleConfirmClick(volume, isBuy, rate, currencyPair)}>
            Confirm
          </Button>
          {isConfirmed && (
            <div>
              <Text size="sm">Volume: {volume}</Text>
              <Text size="sm">{isBuy ? 'Buy' : 'Sell'} at {rate}</Text>
            </div>
          )}
        </div>
      </Paper>
    );
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ marginBottom: '16px' }}>
        {renderConversionForm(
          gbpUsdRate,
          true,
          volumeGbpUsd,
          isBuyGbpUsd,
          handleVolumeGbpUsdChange,
          handleBuySellChange,
          'GBP/USD'
        )}
        {renderConversionForm(
          usdGbpRate,
          false,
          volumeUsdGbp,
          isBuyUsdGbp,
          handleVolumeUsdGbpChange,
          handleBuySellChange,
          'USD/GBP'
        )}
      </div>
      <div>
        <Link to="/trades">Trade history</Link> 
      </div>
      <div>
        <Link to="/login">Logout</Link>
      </div>
    </div>
  );
};

export default Dashboard;
