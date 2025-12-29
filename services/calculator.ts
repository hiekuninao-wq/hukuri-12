
import { SimulationParams, SimulationResult, YearData } from '../types';

/**
 * Calculates compound interest based on initial amount and monthly contributions.
 * Formula: A = P(1 + r/n)^(nt) + PMT * [((1 + r/n)^(nt) - 1) / (r/n)]
 */
export const runSimulation = (params: SimulationParams): SimulationResult => {
  const { initialAmount, monthlyAmount, annualRate, durationYears } = params;
  const monthlyRate = annualRate / 100 / 12;
  
  const yearlyData: YearData[] = [];
  const currentYear = new Date().getFullYear();

  for (let y = 1; y <= durationYears; y++) {
    const months = y * 12;
    let totalAmount = 0;
    
    if (monthlyRate === 0) {
      totalAmount = initialAmount + (monthlyAmount * months);
    } else {
      // Future value of initial principal
      const fvInitial = initialAmount * Math.pow(1 + monthlyRate, months);
      // Future value of monthly contributions (annuity)
      const fvMonthly = monthlyAmount * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
      totalAmount = fvInitial + fvMonthly;
    }
    
    const totalPrincipal = initialAmount + (monthlyAmount * months);
    const totalProfit = totalAmount - totalPrincipal;
    
    yearlyData.push({
      year: y,
      displayYear: currentYear + y,
      totalAmount: Math.round(totalAmount),
      totalPrincipal: Math.round(totalPrincipal),
      totalProfit: Math.round(totalProfit)
    });
  }

  const final = yearlyData[yearlyData.length - 1];
  const profitPercent = final.totalPrincipal > 0 
    ? (final.totalProfit / final.totalPrincipal) * 100 
    : 0;

  return {
    params,
    finalAmount: final.totalAmount,
    totalPrincipal: final.totalPrincipal,
    totalProfit: final.totalProfit,
    profitPercent: parseFloat(profitPercent.toFixed(1)),
    yearlyData
  };
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY', maximumFractionDigits: 0 }).format(amount);
};

export const formatNumber = (amount: number): string => {
  return new Intl.NumberFormat('ja-JP').format(amount);
};
