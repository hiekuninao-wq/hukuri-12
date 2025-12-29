
import React from 'react';

interface WelcomeScreenProps {
  onStart: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col min-h-screen bg-bg-beige text-text-main font-body">
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center animate-fade-in">
        <div className="mb-8 p-6 bg-white rounded-[2.5rem] shadow-soft border border-card-border">
          <span className="material-symbols-outlined text-7xl text-btn-primary select-none">
            account_balance
          </span>
        </div>
        
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold mb-4 tracking-tight font-body text-text-main">
            複利の世界
          </h1>
          <p className="text-text-muted max-w-xs mx-auto leading-relaxed font-medium">
            複利の力で資産の未来を可視化。<br />
            あなたのライフプランに合わせた<br />
            最適な運用シミュレーションを。
          </p>
        </div>

        <button
          onClick={onStart}
          className="w-full max-w-xs h-16 bg-btn-primary hover:bg-btn-primary-hover text-button-text font-black rounded-2xl shadow-lg transition-all active:scale-[0.97] flex items-center justify-center gap-2"
        >
          シミュレーションを始める
          <span className="material-symbols-outlined font-bold">arrow_forward</span>
        </button>
      </div>

      <footer className="p-8 text-center">
        <p className="text-[10px] text-text-muted/60 font-medium tracking-wide">
          © 2025 複利の世界. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default WelcomeScreen;