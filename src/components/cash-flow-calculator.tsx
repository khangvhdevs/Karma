'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Landmark, ShoppingCart, Wallet, TrendingUp, TrendingDown, PiggyBank } from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import CashFlowForecast from '@/components/cash-flow-forecast';

const formatInputValue = (value: string): string => {
  if (!value || value === '-') return value;
  const numberValue = parseFloat(value.replace(/,/g, ''));
  if (isNaN(numberValue)) return '';
  // Check if the original value ends with a decimal point
  const endsWithDecimal = value.endsWith('.') && !value.substring(0, value.length - 1).includes('.');
  const formatted = new Intl.NumberFormat('en-US').format(numberValue);
  
  if (endsWithDecimal) {
    return formatted + '.';
  }
  
  // Handle decimal part if it exists
  if (value.includes('.')) {
      const parts = value.split('.');
      const integerPart = new Intl.NumberFormat('en-US').format(parseFloat(parts[0].replace(/,/g, '')));
      return `${integerPart}.${parts[1]}`;
  }

  return formatted;
};

const parseInputValue = (value: string): number => {
  return parseFloat(value.replace(/,/g, '')) || 0;
};

const InputField = ({ id, label, value, onChange, icon: Icon }: { id: string; label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; icon: React.ElementType }) => (
  <div className="space-y-2">
    <Label htmlFor={id} className="text-base">{label}</Label>
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
      <Input
        id={id}
        type="text" // Change to text to allow commas
        inputMode="decimal"
        placeholder="0"
        value={value}
        onChange={onChange}
        className="pl-10 text-lg h-12"
      />
    </div>
  </div>
);


export default function CashFlowCalculator() {
  const [salary, setSalary] = useState('200');
  const [passiveIncome, setPassiveIncome] = useState('0');
  const [expenses, setExpenses] = useState('100');

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    // Allow only numbers, commas, and a single decimal point
    const sanitizedValue = rawValue.replace(/[^0-9.]/g, '');
    
    const parts = sanitizedValue.split('.');
    if (parts.length > 2) {
      // More than one decimal point, ignore last input
      return;
    }

    const integerPart = parts[0];
    const decimalPart = parts[1];
    
    const formattedInteger = new Intl.NumberFormat('en-US').format(
      Number(integerPart.replace(/,/g, ''))
    );

    let finalValue = formattedInteger;
    if (decimalPart !== undefined) {
      finalValue += `.${decimalPart}`;
    }
    
    setter(finalValue);
  };

  const { totalIncome, monthlyCashFlow } = useMemo(() => {
    const numSalary = parseInputValue(salary);
    const numPassiveIncome = parseInputValue(passiveIncome);
    const numExpenses = parseInputValue(expenses);

    const totalIncome = numSalary + numPassiveIncome;
    const monthlyCashFlow = totalIncome - numExpenses;

    return { totalIncome, monthlyCashFlow };
  }, [salary, passiveIncome, expenses]);

  return (
    <div className="w-full space-y-6">
      <Card className="shadow-lg border-2">
        <CardHeader>
          <CardTitle className="text-2xl font-headline flex items-center gap-2"><Wallet className="h-6 w-6 text-primary" /> Tài chính</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <InputField id="salary" label="Lương (khi qua ô Bắt đầu)" value={salary} onChange={handleInputChange(setSalary)} icon={Landmark} />
          <InputField id="passive" label="Thu nhập thụ động" value={passiveIncome} onChange={handleInputChange(setPassiveIncome)} icon={PiggyBank} />
          <InputField id="expenses" label="Chi phí hàng tháng" value={expenses} onChange={handleInputChange(setExpenses)} icon={ShoppingCart} />
        </CardContent>
      </Card>

      <Card className="shadow-lg border-2 overflow-hidden">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Tóm tắt dòng tiền</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-lg">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Tổng thu nhập</span>
            <span className="font-bold">{formatCurrency(totalIncome)}</span>
          </div>
          <Separator />
          <div key={monthlyCashFlow} className="flex justify-between items-center animate-in fade-in-50 duration-500">
            <span className="text-muted-foreground">Dòng tiền hàng tháng</span>
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
      
      <CashFlowForecast totalIncome={totalIncome} expenses={parseInputValue(expenses)} />
    </div>
  );
}
