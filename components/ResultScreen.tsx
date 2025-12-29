
import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { SimulationResult } from '../types';
import { formatNumber } from '../services/calculator';

interface ResultScreenProps {
  result: SimulationResult;
  onBack: () => void;
  onModify: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ result, onBack, onModify }) => {
  const [showDetails, setShowDetails] = useState(false);

  // Ensure the page starts at the top when this screen is shown
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const chartData = result.yearlyData.map(d => ({
    name: `${d.year}年`,
    principal: d.totalPrincipal,
    profit: d.totalProfit,
    total: d.totalAmount
  }));

  const handleShare = async () => {
    try {
      const url = window.location.origin;
      await navigator.clipboard.writeText(url);
      alert('アプリのURLをコピーしました！\nSNSなどでシェアして使ってください。');
    } catch (err) {
      console.error('Failed to copy URL: ', err);
    }
  };

  const formatYAxis = (value: number) => {
    if (value === 0) return '0';
    const absValue = Math.abs(value);
    const sign = value < 0 ? '-' : '';
    
    if (absValue >= 100000000) return `${sign}${(absValue / 100000000).toFixed(1)}億円`;
    if (absValue >= 10000000) return `${sign}${(absValue / 10000000).toFixed(1)}千万`;
    if (absValue >= 10000) return `${sign}${(absValue / 10000).toFixed(0)}万`;
    return value.toString();
  };

  return (
    <div className="bg-background-light text-text-main min-h-screen flex flex-col mx-auto max-w-md shadow-2xl relative">
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="flex items-center justify-between px-4 h-16">
          <button 
            onClick={onBack}
            className="flex items-center justify-center w-12 h-12 rounded-full hover:bg-gray-100 transition-colors text-text-main"
          >
            <span className="material-symbols-outlined text-2xl font-bold">arrow_back</span>
          </button>
          <h1 className="text-lg font-bold tracking-tight text-text-main font-display">シミュレーション結果</h1>
          <button 
            onClick={handleShare}
            className="flex items-center justify-center w-12 h-12 rounded-full hover:bg-gray-100 transition-colors text-text-main"
          >
            <span className="material-symbols-outlined text-2xl font-bold">share</span>
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-x-hidden pb-12 animate-fade-in bg-background-light">
        {/* Main Hero Card */}
        <div className="px-6 pt-5 pb-4 text-center bg-white border-b border-gray-100 shadow-sm">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-50 border border-gray-200 mb-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
            <span className="text-text-muted text-[11px] font-black tracking-widest uppercase">
              <span className="text-[14px] leading-none inline-block align-baseline mr-0.5">{result.params.durationYears}</span>
              年後の合計金額
            </span>
          </div>
          
          {/* Removed ¥ symbol */}
          <h2 className="text-[30px] font-black tracking-tighter text-text-main mb-2 font-display leading-none tabular-nums">
            {formatNumber(result.finalAmount)}
          </h2>

          {/* Info Grid */}
          <div className="flex items-center justify-between gap-1 max-w-sm mx-auto mb-3">
            {/* Block 1: Monthly Amount */}
            <div className="flex-1 flex flex-col items-center justify-center py-1">
              <div className="flex items-center gap-1 mb-1 text-primary/70">
                <span className="material-symbols-outlined text-[12px] font-black">payments</span>
                <span className="text-[9px] font-black uppercase tracking-widest whitespace-nowrap">毎月の金額</span>
              </div>
              {/* Removed ¥ symbol */}
              <span className="text-[17px] font-black text-text-main font-display leading-none whitespace-nowrap tracking-tighter tabular-nums">
                {formatNumber(result.params.monthlyAmount)}
              </span>
            </div>

            {/* Block 2: Interest Rate */}
            <div className="flex-1 flex flex-col items-center justify-center gap-1 text-primary bg-btn-primary/20 px-0.5 py-1.5 rounded-[2rem] border border-btn-primary/30 shadow-sm relative z-10">
              <div className="flex items-center gap-1 text-primary/80">
                <span className="material-symbols-outlined text-[12px] font-black">tune</span>
                <span className="text-[9px] font-black uppercase tracking-widest whitespace-nowrap">利率 (年利)</span>
              </div>
              <div className="flex items-baseline gap-0.5">
                <span className="font-black text-[23px] leading-none font-display tabular-nums">{result.params.annualRate}</span>
                <span className="text-[11px] font-black font-display">%</span>
              </div>
            </div>

            {/* Block 3: Initial Assets */}
            <div className="flex-1 flex flex-col items-center justify-center py-1">
              <div className="flex items-center gap-1 mb-1 text-primary/70">
                <span className="material-symbols-outlined text-[12px] font-black">savings</span>
                <span className="text-[9px] font-black uppercase tracking-widest whitespace-nowrap">初期資産</span>
              </div>
              {/* Removed ¥ symbol */}
              <span className="text-[17px] font-black text-text-main font-display leading-none whitespace-nowrap tracking-tighter tabular-nums">
                {formatNumber(result.params.initialAmount)}
              </span>
            </div>
          </div>

          {/* Detail Summary Cards */}
          <div className="grid grid-cols-2 gap-3 mt-1">
            <div className="bg-stone-50 px-3 py-2 rounded-3xl border border-gray-100 flex flex-col items-center text-center">
              <div className="flex items-center gap-1 mb-1">
                <span className="material-symbols-outlined text-base text-text-muted">account_balance_wallet</span>
                <span className="text-[9px] font-black text-text-muted uppercase tracking-widest">累計積立元本</span>
              </div>
              {/* Removed ¥ symbol */}
              <p className="text-lg font-black tracking-tighter text-text-main font-display leading-none tabular-nums">
                {formatNumber(result.totalPrincipal)}
              </p>
            </div>

            <div className="bg-btn-primary/20 px-3 py-2 rounded-3xl border border-btn-primary/30 flex flex-col items-center text-center">
              <div className="flex items-center gap-1 mb-1 text-primary">
                <span className="material-symbols-outlined text-base">monetization_on</span>
                <span className="text-[9px] font-black uppercase tracking-widest">運用収益合計</span>
              </div>
              {/* Removed ¥ symbol */}
              <p className="text-lg font-black tracking-tighter text-primary font-display leading-none tabular-nums">
                {result.totalProfit >= 0 ? '+' : ''}{formatNumber(result.totalProfit)}
              </p>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="px-6 mt-6 mb-6">
          <div className="bg-white rounded-[2.5rem] pt-6 pb-2 px-0 shadow-soft border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between mb-6 px-7">
              <h3 className="font-black text-text-main flex items-center gap-2 text-sm uppercase tracking-widest">
                <span className="material-symbols-outlined text-text-muted text-xl">analytics</span>
                <span>資産推移グラフ</span>
              </h3>
              <div className="flex gap-4 text-[10px] font-black uppercase tracking-widest">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-stone-300"></span>
                  <span className="text-text-muted">元金</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
                  <span className="text-primary">収益</span>
                </div>
              </div>
            </div>
            
            <div className="w-full h-[240px] relative">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0369a1" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#0369a1" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="colorPrincipal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7A736B" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#7A736B" stopOpacity={0.05}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 11, fill: '#7A736B', fontWeight: 900 }}
                    interval={Math.floor(chartData.length / 4)}
                  />
                  <YAxis 
                    tickFormatter={formatYAxis} 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 11, fill: '#7A736B', fontWeight: 900 }}
                    width={80}
                  />
                  <Tooltip 
                    formatter={(value: number) => formatNumber(value)}
                    contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 12px 40px rgba(0,0,0,0.12)', fontSize: '14px', fontWeight: '900' }}
                  />
                  <Area name="元金" type="monotone" dataKey="principal" stackId="1" stroke="#7A736B" fill="url(#colorPrincipal)" strokeWidth={2} isAnimationActive={false} />
                  <Area name="収益" type="monotone" dataKey="profit" stackId="1" stroke="#0369a1" fill="url(#colorProfit)" strokeWidth={3} isAnimationActive={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Details Table */}
        <div className="px-6 mb-8">
          <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="font-black text-text-main text-sm uppercase tracking-widest flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-primary rounded-full shadow-glow"></span>
              年次シミュレーション詳細
            </h3>
            <button 
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-btn-primary text-button-text font-black text-[10px] uppercase tracking-wider hover:bg-btn-primary-hover transition-colors shadow-pastel-btn active:scale-95"
            >
              <span className="material-symbols-outlined text-sm">
                {showDetails ? 'expand_less' : 'expand_more'}
              </span>
              {showDetails ? '非表示' : '表示'}
            </button>
          </div>
          
          {showDetails && (
            <div className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-soft animate-fade-in">
              {/* Header */}
              <div className="grid grid-cols-12 gap-2 px-5 py-1.5 bg-gray-50/50 border-b border-gray-100 text-[10px] font-black text-text-muted uppercase tracking-[0.1em]">
                <div className="col-span-2">年数</div>
                <div className="col-span-5 text-right">資産合計</div>
                <div className="col-span-5 text-right">運用収益</div>
              </div>

              <div className="divide-y divide-gray-50">
                {result.yearlyData.map((data) => {
                  const isLast = data.year === result.params.durationYears;
                  
                  return (
                    <div 
                      key={data.year} 
                      className={`grid grid-cols-12 gap-2 px-5 py-0.5 items-center transition-colors hover:bg-gray-50/30 ${isLast ? 'bg-primary/5' : ''}`}
                    >
                      <div className="col-span-2 py-0.5">
                        <span className={`text-[11px] font-black px-1.5 py-0.5 rounded-md border-2 transition-all inline-block min-w-[40px] text-center ${
                          isLast ? 'bg-primary text-white border-primary shadow-sm' : 'bg-white text-text-muted border-gray-100'
                        }`}>
                          {data.year}年
                        </span>
                      </div>
                      <div className="col-span-5 text-right">
                        {/* Removed ¥ symbol */}
                        <span className="text-[14px] font-black font-display tracking-tighter tabular-nums text-text-main leading-none">
                          {formatNumber(data.totalAmount)}
                        </span>
                      </div>
                      <div className="col-span-5 text-right">
                        {/* Removed ¥ symbol */}
                        <span className={`text-[14px] font-black font-display tracking-tighter tabular-nums leading-none ${isLast ? 'text-primary' : (data.totalProfit >= 0 ? 'text-emerald-600' : 'text-red-600')}`}>
                          {data.totalProfit >= 0 ? '+' : ''}{formatNumber(data.totalProfit)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 px-6 mb-12">
           <button 
              onClick={onModify}
              className="flex-1 py-2.5 px-4 rounded-2xl border-2 border-gray-100 font-black text-text-muted bg-white hover:bg-gray-50 active:scale-[0.98] transition-all text-xs sm:text-sm shadow-sm flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">edit</span>
              条件を修正
            </button>
            <a 
              href="https://pmam.co.jp/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2.5 px-4 rounded-2xl bg-btn-primary hover:bg-btn-primary-hover text-button-text font-black shadow-xl shadow-btn-primary/30 active:scale-[0.98] transition-all text-[10px] sm:text-xs flex flex-col items-center justify-center leading-tight text-center"
            >
              パリミキアセット
              <span className="block">マネジメントへ</span>
            </a>
        </div>
      </main>
    </div>
  );
};

export default ResultScreen;
