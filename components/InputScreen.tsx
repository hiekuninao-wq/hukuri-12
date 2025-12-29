
import React from 'react';
import { SimulationParams } from '../types';
import { formatNumber } from '../services/calculator';

interface InputScreenProps {
  initialParams: SimulationParams;
  onCalculate: (params: SimulationParams) => void;
  onBack: () => void;
}

const InputScreen: React.FC<InputScreenProps> = ({ initialParams, onCalculate, onBack }) => {
  // 状態管理（表示用のカンマ区切り文字列）
  const [initialAmountStr, setInitialAmountStr] = React.useState(
    initialParams.initialAmount === 0 ? '' : formatNumber(initialParams.initialAmount)
  );
  const [monthlyAmountStr, setMonthlyAmountStr] = React.useState(
    initialParams.monthlyAmount === 0 ? '' : formatNumber(initialParams.monthlyAmount)
  );
  const [annualRateStr, setAnnualRateStr] = React.useState(
    initialParams.annualRate === 0 ? '' : initialParams.annualRate.toString()
  );
  const [durationYearsStr, setDurationYearsStr] = React.useState(
    initialParams.durationYears === 0 ? '' : initialParams.durationYears.toString()
  );

  const presets = [
    { label: '3% (安定)', value: 3 },
    { label: '5% (中間)', value: 5 },
    { label: '7% (積極)', value: 7 },
  ];

  const handleCalculate = () => {
    // カンマとマイナスを考慮してパース
    const parseFormatted = (str: string) => {
      const normalized = str.replace(/,/g, '');
      if (normalized === '' || normalized === '-') return 0;
      return parseInt(normalized, 10);
    };

    const params: SimulationParams = {
      initialAmount: parseFormatted(initialAmountStr),
      monthlyAmount: parseFormatted(monthlyAmountStr),
      annualRate: parseFloat(annualRateStr) || 0,
      durationYears: parseInt(durationYearsStr) || 0,
    };
    onCalculate(params);
  };

  const handlePresetClick = (val: number) => {
    setAnnualRateStr(val.toString());
  };

  /**
   * 数値入力用ハンドラー
   * @param value 入力値
   * @param setter ステート更新関数
   * @param allowNegative 負の数を許可するかどうか
   */
  const handleFormattedNumberChange = (value: string, setter: (v: string) => void, allowNegative: boolean = false) => {
    // 1. 全角数字を半角に変換、各種ハイフンを半角マイナスに統一
    let normalized = value
      .replace(/[０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xFEE0))
      .replace(/[ー—－−-]/g, '-');
    
    // 2. 負の数かどうかの判定（許可されている場合のみ）
    const isNegative = allowNegative && normalized.startsWith('-');
    
    // 3. 数字以外の文字を除去
    const rawDigits = normalized.replace(/\D/g, '');
    
    if (rawDigits === '') {
      setter(isNegative ? '-' : '');
      return;
    }
    
    // 最大12桁までに制限
    if (rawDigits.length > 12) return;

    const numericValue = parseInt(rawDigits, 10);
    const formatted = formatNumber(numericValue);
    setter(isNegative ? `-${formatted}` : formatted);
  };

  return (
    <div className="w-full max-w-md bg-background-light min-h-screen flex flex-col relative mx-auto shadow-2xl overflow-hidden">
      <header className="flex items-center justify-between px-4 py-3 bg-background-light sticky top-0 z-10">
        <button 
          onClick={onBack}
          className="flex items-center justify-center size-10 rounded-full text-text-main hover:bg-text-main/5 transition-colors"
        >
          <span className="material-symbols-outlined text-[24px]">arrow_back</span>
        </button>
        <h1 className="text-text-main text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-10 font-display">
          条件入力
        </h1>
      </header>

      <main className="flex-1 flex flex-col px-6 pb-32 overflow-y-auto animate-fade-in">
        <div className="pt-4 pb-8">
          <h2 className="text-text-main text-[26px] font-extrabold leading-tight tracking-tight whitespace-nowrap">
            資産運用のシミュレーション
          </h2>
          <p className="text-text-sub text-sm mt-3 font-medium text-text-muted leading-relaxed">
            将来のために条件を入力してください。
          </p>
        </div>

        {/* 利率 */}
        <div className="flex flex-col mb-8">
          <label className="flex flex-col w-full group">
            <span className="text-text-main text-sm font-bold mb-2 ml-1">利率 (年利)</span>
            <div className="flex w-full items-stretch rounded-3xl shadow-sm ring-1 ring-card-border focus-within:ring-2 focus-within:ring-btn-primary focus-within:bg-btn-primary/5 transition-all bg-white overflow-hidden">
              <input 
                className="flex-1 w-full min-w-0 border-none bg-transparent text-text-main focus:ring-0 h-16 pl-6 pr-2 text-2xl font-bold"
                inputMode="decimal"
                type="number"
                step="0.1"
                placeholder="0"
                value={annualRateStr}
                onChange={(e) => setAnnualRateStr(e.target.value)}
              />
              <div className="flex items-center justify-center px-6 bg-transparent text-primary">
                <span className="material-symbols-outlined font-bold">percent</span>
              </div>
            </div>
          </label>
          
          <div className="flex gap-2 overflow-x-auto no-scrollbar mt-4 mb-2 pl-1 py-2">
            {presets.map((preset) => (
              <button
                key={preset.value}
                onClick={() => handlePresetClick(preset.value)}
                className={`flex h-9 shrink-0 items-center justify-center rounded-full px-4 text-xs font-black transition-all ${
                  annualRateStr === preset.value.toString()
                  ? 'bg-btn-primary text-button-text shadow-md shadow-btn-primary/30 ring-2 ring-btn-primary ring-offset-2 ring-offset-background-light'
                  : 'bg-white border border-card-border text-text-muted hover:border-btn-primary/50 hover:text-primary'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* 毎月の積立金額 */}
        <div className="flex flex-col gap-3 mb-8">
          <label className="flex flex-col w-full group">
            <div className="flex items-baseline gap-2 mb-2 ml-1">
              <span className="text-text-main text-sm font-bold shrink-0">毎月の積立金額</span>
              <span className="text-[10px] text-text-muted font-medium truncate">引き出しの場合は「-」を入力</span>
            </div>
            <div className="flex w-full items-stretch rounded-3xl shadow-sm ring-1 ring-card-border focus-within:ring-2 focus-within:ring-btn-primary focus-within:bg-btn-primary/5 transition-all bg-white overflow-hidden">
              <input 
                className="flex-1 w-full min-w-0 border-none bg-transparent text-text-main focus:ring-0 h-16 pl-6 pr-2 text-2xl font-bold"
                inputMode="text"
                type="text"
                placeholder="0"
                value={monthlyAmountStr}
                onChange={(e) => handleFormattedNumberChange(e.target.value, setMonthlyAmountStr, true)}
              />
              <div className="flex items-center justify-center px-6 bg-transparent text-text-muted min-w-[3.5rem]">
                <span className="text-sm font-bold">円</span>
              </div>
            </div>
          </label>
        </div>

        {/* 運用年数 */}
        <div className="flex flex-col gap-3 mb-8">
          <label className="flex flex-col w-full group">
            <span className="text-text-main text-sm font-bold mb-2 ml-1">運用年数</span>
            <div className="flex w-full items-stretch rounded-3xl shadow-sm ring-1 ring-card-border focus-within:ring-2 focus-within:ring-btn-primary focus-within:bg-btn-primary/5 transition-all bg-white overflow-hidden">
              <input 
                className="flex-1 w-full min-w-0 border-none bg-transparent text-text-main focus:ring-0 h-16 pl-6 pr-2 text-2xl font-bold"
                inputMode="numeric"
                type="number"
                placeholder="0"
                value={durationYearsStr}
                onChange={(e) => setDurationYearsStr(e.target.value)}
              />
              <div className="flex items-center justify-center px-6 bg-transparent text-text-muted min-w-[3.5rem]">
                <span className="text-sm font-bold">年</span>
              </div>
            </div>
          </label>
        </div>

        {/* 初期資産 */}
        <div className="flex flex-col gap-3 mb-12">
          <label className="flex flex-col w-full group">
            <div className="flex items-baseline gap-2 mb-2 ml-1">
              <span className="text-text-main text-sm font-bold shrink-0">初期資産</span>
              <span className="text-[10px] text-text-muted font-medium truncate">現在持っている運用可能な資金</span>
            </div>
            <div className="flex w-full items-stretch rounded-3xl shadow-sm ring-1 ring-card-border focus-within:ring-2 focus-within:ring-btn-primary focus-within:bg-btn-primary/5 transition-all bg-white overflow-hidden">
              <input 
                className="flex-1 w-full min-w-0 border-none bg-transparent text-text-main focus:ring-0 h-16 pl-6 pr-2 text-2xl font-bold"
                inputMode="text"
                type="text"
                placeholder="0"
                value={initialAmountStr}
                onChange={(e) => handleFormattedNumberChange(e.target.value, setInitialAmountStr, false)}
              />
              <div className="flex items-center justify-center px-6 bg-transparent text-text-muted min-w-[3.5rem]">
                <span className="text-sm font-bold">円</span>
              </div>
            </div>
          </label>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background-light via-background-light/95 to-transparent z-20 flex justify-center w-full">
        <div className="w-full max-w-md">
          <button 
            onClick={handleCalculate}
            className="w-full h-14 rounded-full bg-btn-primary hover:bg-btn-primary-hover active:scale-[0.98] transition-all shadow-xl shadow-btn-primary/30 flex items-center justify-center gap-2 text-button-text font-black text-lg"
          >
            <span className="material-symbols-outlined font-bold">calculate</span>
            計算を実行
          </button>
        </div>
      </div>
    </div>
  );
};

export default InputScreen;
