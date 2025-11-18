import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Activity, Bot, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const AiTradingApp = () => {
  const [balance, setBalance] = useState(10000);
  const [selectedStock, setSelectedStock] = useState('AAPL');
  const [positions, setPositions] = useState([]);
  const [aiPrediction, setAiPrediction] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [priceData, setPriceData] = useState([]);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [tradeAmount, setTradeAmount] = useState(1);

  const stocks = [
    { symbol: 'AAPL', name: 'Apple Inc.', basePrice: 178.50 },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', basePrice: 141.80 },
    { symbol: 'MSFT', name: 'Microsoft Corp.', basePrice: 378.91 },
    { symbol: 'TSLA', name: 'Tesla Inc.', basePrice: 242.84 },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', basePrice: 146.57 }
  ];

  const getStockInfo = (symbol) => stocks.find(s => s.symbol === symbol);

  // Generate realistic price data with slight variations
  useEffect(() => {
    const stock = getStockInfo(selectedStock);
    const generateData = () => {
      const data = [];
      let price = stock.basePrice;
      
      for (let i = 0; i < 30; i++) {
        const change = (Math.random() - 0.48) * 2;
        price = Math.max(price + change, stock.basePrice * 0.9);
        data.push({
          time: `${i}m`,
          price: parseFloat(price.toFixed(2)),
          volume: Math.floor(Math.random() * 1000000) + 500000
        });
      }
      return data;
    };

    const data = generateData();
    setPriceData(data);
    setCurrentPrice(data[data.length - 1].price);
  }, [selectedStock]);

  // Simulate real-time price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setPriceData(prev => {
        const newData = [...prev];
        const lastPrice = newData[newData.length - 1].price;
        const change = (Math.random() - 0.48) * 0.5;
        const newPrice = parseFloat((lastPrice + change).toFixed(2));
        
        newData.shift();
        newData.push({
          time: 'now',
          price: newPrice,
          volume: Math.floor(Math.random() * 1000000) + 500000
        });
        
        setCurrentPrice(newPrice);
        return newData;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const analyzeWithAI = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      const trend = Math.random() > 0.5 ? 'bullish' : 'bearish';
      const confidence = Math.floor(Math.random() * 30) + 70;
      const targetPrice = trend === 'bullish' 
        ? currentPrice * (1 + Math.random() * 0.05)
        : currentPrice * (1 - Math.random() * 0.05);
      
      setAiPrediction({
        trend,
        confidence,
        targetPrice: targetPrice.toFixed(2),
        timeframe: '24h',
        factors: [
          'Technical indicators show strong momentum',
          'Volume analysis suggests increased interest',
          'Market sentiment is favorable',
          'Historical patterns align with prediction'
        ]
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  const executeTrade = (type) => {
    const stock = getStockInfo(selectedStock);
    const totalCost = currentPrice * tradeAmount;

    if (type === 'buy') {
      if (balance >= totalCost) {
        setBalance(prev => prev - totalCost);
        setPositions(prev => [...prev, {
          id: Date.now(),
          symbol: selectedStock,
          name: stock.name,
          type: 'buy',
          shares: tradeAmount,
          price: currentPrice,
          timestamp: new Date().toLocaleTimeString()
        }]);
      } else {
        alert('Insufficient balance!');
      }
    } else {
      const position = positions.find(p => p.symbol === selectedStock && p.shares >= tradeAmount);
      if (position) {
        setBalance(prev => prev + totalCost);
        setPositions(prev => prev.filter(p => p.id !== position.id));
      } else {
        alert('No position to sell!');
      }
    }
  };

  const calculatePnL = () => {
    return positions.reduce((total, pos) => {
      return total + (currentPrice - pos.price) * pos.shares;
    }, 0);
  };

  const pnl = calculatePnL();
  const stock = getStockInfo(selectedStock);
  const priceChange = priceData.length > 1 
    ? ((priceData[priceData.length - 1].price - priceData[0].price) / priceData[0].price * 100).toFixed(2)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500 p-3 rounded-xl">
              <Bot size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold">AI Trading Platform</h1>
              <p className="text-blue-300">Powered by Advanced Analytics</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">Portfolio Balance</p>
            <p className="text-3xl font-bold">${balance.toLocaleString()}</p>
            <p className={`text-sm ${pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {pnl >= 0 ? '+' : ''}{pnl.toFixed(2)} P&L
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chart Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stock Selector */}
            <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  {stocks.map(s => (
                    <button
                      key={s.symbol}
                      onClick={() => setSelectedStock(s.symbol)}
                      className={`px-4 py-2 rounded-lg font-semibold transition ${
                        selectedStock === s.symbol
                          ? 'bg-blue-500 text-white'
                          : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                      }`}
                    >
                      {s.symbol}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex items-end gap-4">
                <div>
                  <h2 className="text-2xl font-bold">{stock.name}</h2>
                  <p className="text-4xl font-bold mt-2">${currentPrice}</p>
                </div>
                <div className={`flex items-center gap-1 ${parseFloat(priceChange) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {parseFloat(priceChange) >= 0 ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
                  <span className="text-xl font-semibold">{priceChange}%</span>
                </div>
              </div>
            </div>

            {/* Price Chart */}
            <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Activity size={20} />
                Live Price Chart
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={priceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="time" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" domain={['auto', 'auto']} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1e293b', 
                      border: '1px solid #475569',
                      borderRadius: '8px'
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="price" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Trading Panel */}
            <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <DollarSign size={20} />
                Execute Trade
              </h3>
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <label className="block text-sm text-gray-400 mb-2">Shares</label>
                  <input
                    type="number"
                    value={tradeAmount}
                    onChange={(e) => setTradeAmount(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full bg-slate-700 rounded-lg px-4 py-3 text-white font-semibold"
                    min="1"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm text-gray-400 mb-2">Total Cost</label>
                  <div className="bg-slate-700 rounded-lg px-4 py-3 font-semibold">
                    ${(currentPrice * tradeAmount).toFixed(2)}
                  </div>
                </div>
                <button
                  onClick={() => executeTrade('buy')}
                  className="bg-green-500 hover:bg-green-600 px-8 py-3 rounded-lg font-semibold transition flex items-center gap-2"
                >
                  <ArrowUpRight size={20} />
                  Buy
                </button>
                <button
                  onClick={() => executeTrade('sell')}
                  className="bg-red-500 hover:bg-red-600 px-8 py-3 rounded-lg font-semibold transition flex items-center gap-2"
                >
                  <ArrowDownRight size={20} />
                  Sell
                </button>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* AI Analysis */}
            <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Bot size={20} />
                AI Market Analysis
              </h3>
              
              <button
                onClick={analyzeWithAI}
                disabled={isAnalyzing}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 py-3 rounded-lg font-semibold mb-4 transition"
              >
                {isAnalyzing ? 'Analyzing...' : 'Run AI Analysis'}
              </button>

              {aiPrediction && (
                <div className="space-y-3">
                  <div className={`p-4 rounded-lg ${
                    aiPrediction.trend === 'bullish' ? 'bg-green-500/20' : 'bg-red-500/20'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">Prediction</span>
                      <span className={`font-bold ${
                        aiPrediction.trend === 'bullish' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {aiPrediction.trend.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-sm text-gray-300">
                      <p>Target: ${aiPrediction.targetPrice}</p>
                      <p>Confidence: {aiPrediction.confidence}%</p>
                      <p>Timeframe: {aiPrediction.timeframe}</p>
                    </div>
                  </div>
                  
                  <div className="text-sm space-y-2">
                    <p className="font-semibold text-gray-400">Key Factors:</p>
                    {aiPrediction.factors.map((factor, i) => (
                      <div key={i} className="flex items-start gap-2 text-gray-300">
                        <span className="text-blue-400">•</span>
                        <span>{factor}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Positions */}
            <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700">
              <h3 className="text-xl font-semibold mb-4">Open Positions</h3>
              <div className="space-y-3">
                {positions.length === 0 ? (
                  <p className="text-gray-400 text-center py-4">No open positions</p>
                ) : (
                  positions.map(pos => (
                    <div key={pos.id} className="bg-slate-700 rounded-lg p-3">
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <p className="font-semibold">{pos.symbol}</p>
                          <p className="text-sm text-gray-400">{pos.shares} shares</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-400">Entry: ${pos.price}</p>
                          <p className={`text-sm font-semibold ${
                            (currentPrice - pos.price) >= 0 ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {((currentPrice - pos.price) * pos.shares).toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">{pos.timestamp}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiTradingApp;