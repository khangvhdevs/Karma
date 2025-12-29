'use client';

import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Landmark, ShoppingCart, Wallet, TrendingUp, TrendingDown, PiggyBank } from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';

const InputField = ({ id, label, value, onChange, icon: Icon }: { id: string; label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; icon: React.ElementType }) => (
  <div className="space-y-2">
    <Label htmlFor={id} className="text-base">{label}</Label>
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
      <Input
        id={id}
        type="text"
        inputMode="decimal"
        placeholder="0"
        value={value}
        onChange={onChange}
        className="pl-10 text-lg h-12"
      />
    </div>
  </div>
);

const initialValues = {
  salary: '200',
  passiveIncome: '0',
  expenses: '100',
};

// We are defining these functions here so we can export and use them on the parent page
// Ideally we would move all the state up to the parent page, but this is a quicker solution
let setSalary: React.Dispatch<React.SetStateAction<string>> = () => {};
let setPassiveIncome: React.Dispatch<React.SetStateAction<string>> = () => {};
let setExpenses: React.Dispatch<React.SetStateAction<string>> = () => {};

export const handleReset = () => {
  setSalary(initialValues.salary);
  setPassiveIncome(initialValues.passiveIncome);
  setExpenses(initialValues.expenses);
};

export default function CashFlowCalculator() {
  const [salaryState, setSalaryState] = useState(initialValues.salary);
  const [passiveIncomeState, setPassiveIncomeState] = useState(initialValues.passiveIncome);
  const [expensesState, setExpensesState] = useState(initialValues.expenses);
  const [isClient, setIsClient] = useState(false);
  
  // Assign the state setters to the outer-scope variables
  setSalary = setSalaryState;
  setPassiveIncome = setPassiveIncomeState;
  setExpenses = setExpensesState;


  useEffect(() => {
    setIsClient(true);
    try {
      const savedSalary = localStorage.getItem('cashflow-salary');
      const savedPassiveIncome = localStorage.getItem('cashflow-passiveIncome');
      const savedExpenses = localStorage.getItem('cashflow-expenses');

      if (savedSalary !== null) setSalaryState(savedSalary);
      if (savedPassiveIncome !== null) setPassiveIncomeState(savedPassiveIncome);
      if (savedExpenses !== null) setExpensesState(savedExpenses);
    } catch (error) {
      console.error('Failed to read from localStorage', error);
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      try {
        localStorage.setItem('cashflow-salary', salaryState);
        localStorage.setItem('cashflow-passiveIncome', passiveIncomeState);
        localStorage.setItem('cashflow-expenses', expensesState);
      } catch (error) {
        console.error('Failed to write to localStorage', error);
      }
    }
  }, [salaryState, passiveIncomeState, expensesState, isClient]);

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const sanitizedValue = rawValue.replace(/[^0-9.]/g, '');
    
    const parts = sanitizedValue.split('.');
    if (parts.length > 2) {
      return;
    }

    const integerPart = parts[0] ? new Intl.NumberFormat('en-US').format(
      Number(parts[0].replace(/,/g, ''))
    ) : '';

    let finalValue = integerPart;
    if (parts[1] !== undefined) {
      finalValue += `.${parts[1]}`;
    }
    
    setter(finalValue || '0');
  };

  const { totalIncome, monthlyCashFlow } = useMemo(() => {
    const parseInputValue = (value: string): number => {
      return parseFloat(value.replace(/,/g, '')) || 0;
    };
    
    const numSalary = parseInputValue(salaryState);
    const numPassiveIncome = parseInputValue(passiveIncomeState);
    const numExpenses = parseInputValue(expensesState);

    const totalIncome = numSalary + numPassiveIncome;
    const monthlyCashFlow = totalIncome - numExpenses;

    return { totalIncome, monthlyCashFlow };
  }, [salaryState, passiveIncomeState, expensesState]);

  return (
    <div className="w-full space-y-6">
      <Card className="shadow-lg border-2">
        <CardHeader>
          <CardTitle className="text-2xl font-headline flex items-center gap-2"><Wallet className="h-6 w-6 text-primary" /> Finances</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <InputField id="salary" label="Salary (on Payday)" value={salaryState} onChange={handleInputChange(setSalaryState)} icon={Landmark} />
          <InputField id="passive" label="Passive Income" value={passiveIncomeState} onChange={handleInputChange(setPassiveIncomeState)} icon={PiggyBank} />
          <InputField id="expenses" label="Monthly Expenses" value={expensesState} onChange={handleInputChange(setExpensesState)} icon={ShoppingCart} />
        </CardContent>
      </Card>

      <Card className="shadow-lg border-2 overflow-hidden">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Cash Flow Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-lg">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Total Income</span>
            <span className="font-bold">{formatCurrency(totalIncome)}</span>
          </div>
          <Separator />
          <div key={monthlyCashFlow} className="flex justify-between items-center animate-in fade-in-50 duration-500">
            <span className="text-muted-foreground">Monthly Cash Flow</span>
            <span className={cn(
              "font-bold text-xl flex items-center gap-2",
              monthlyCashFlow >= 0 ? "text-success" : "text-destructive"
            )}>
              {monthlyCashFlow >= 0 ? <TrendingUp className="h-6 w-6" /> : <TrendingDown className="h-6 w-6" />}
              {formatCurrency(monthlyCashFlow)}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
