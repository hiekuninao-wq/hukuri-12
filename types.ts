
export interface SimulationParams {
  initialAmount: number;
  monthlyAmount: number;
  annualRate: number;
  durationYears: number;
}

export interface YearData {
  year: number;
  totalAmount: number;
  totalPrincipal: number;
  totalProfit: number;
  displayYear: number;
}

export interface SimulationResult {
  params: SimulationParams;
  finalAmount: number;
  totalPrincipal: number;
  totalProfit: number;
  profitPercent: number;
  yearlyData: YearData[];
}
