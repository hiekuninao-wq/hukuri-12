
import React, { useState, useCallback } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import InputScreen from './components/InputScreen';
import ResultScreen from './components/ResultScreen';
import { SimulationParams, SimulationResult } from './types';
import { runSimulation } from './services/calculator';

type Screen = 'welcome' | 'input' | 'result';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [params, setParams] = useState<SimulationParams>({
    initialAmount: 0,
    monthlyAmount: 30000,
    annualRate: 5,
    durationYears: 20
  });
  const [result, setResult] = useState<SimulationResult | null>(null);

  const handleStartSimulation = () => {
    setCurrentScreen('input');
  };

  const handleRunCalculation = useCallback((newParams: SimulationParams) => {
    setParams(newParams);
    const simulationResult = runSimulation(newParams);
    setResult(simulationResult);
    setCurrentScreen('result');
  }, []);

  const handleGoBack = () => {
    if (currentScreen === 'result') {
      setCurrentScreen('input');
    } else if (currentScreen === 'input') {
      setCurrentScreen('welcome');
    }
  };

  return (
    <div className="min-h-screen bg-background-light transition-all duration-300">
      {currentScreen === 'welcome' && (
        <WelcomeScreen onStart={handleStartSimulation} />
      )}
      {currentScreen === 'input' && (
        <InputScreen 
          initialParams={params} 
          onCalculate={handleRunCalculation} 
          onBack={handleGoBack} 
        />
      )}
      {currentScreen === 'result' && result && (
        <ResultScreen 
          result={result} 
          onBack={handleGoBack} 
          onModify={handleGoBack}
        />
      )}
    </div>
  );
};

export default App;
