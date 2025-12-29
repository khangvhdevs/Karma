'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Delete, Wallet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const formatNumber = (numStr: string) => {
  if (numStr === 'Error') return numStr;
  if (numStr.endsWith('.')) {
    const numPart = numStr.slice(0, -1);
    const parsedNum = parseFloat(numPart.replace(/,/g, ''));
    if (isNaN(parsedNum)) return '0.';
    return new Intl.NumberFormat('en-US').format(parsedNum) + '.';
  }

  const num = parseFloat(numStr.replace(/,/g, ''));
  if (isNaN(num)) return '0';
  
  const [integerPart, decimalPart] = numStr.split('.');

  const formattedIntegerPart = new Intl.NumberFormat('en-US').format(
    parseInt(integerPart.replace(/,/g, ''), 10) || 0
  );

  return decimalPart !== undefined
    ? `${formattedIntegerPart}.${decimalPart}`
    : formattedIntegerPart;
};

export default function Calculator() {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<string | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(true);
  const [history, setHistory] = useState('');
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const getMonthlyCashFlow = () => {
    try {
      const savedSalary = localStorage.getItem('cashflow-salary') || '0';
      const savedPassiveIncome = localStorage.getItem('cashflow-passiveIncome') || '0';
      const savedExpenses = localStorage.getItem('cashflow-expenses') || '0';

      const numSalary = parseFloat(savedSalary.replace(/,/g, '')) || 0;
      const numPassiveIncome = parseFloat(savedPassiveIncome.replace(/,/g, '')) || 0;
      const numExpenses = parseFloat(savedExpenses.replace(/,/g, '')) || 0;

      return numSalary + numPassiveIncome - numExpenses;
    } catch (error) {
      console.error('Failed to read cash flow data from localStorage', error);
      return 0;
    }
  };

  const handleLoadCashFlow = () => {
    if (isClient) {
      const cashFlow = getMonthlyCashFlow();
      setDisplay(cashFlow.toString());
      setWaitingForOperand(false);
    }
  };

  const handleNumberClick = (num: string) => {
    if (display.length >= 15 && !waitingForOperand) return;

    if (waitingForOperand) {
      setDisplay(num);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const handleDecimalClick = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
      return;
    }
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };
  
  const handleToggleSignClick = () => {
    if (display === '0' || display === 'Error') return;
    const newValue = (parseFloat(display.replace(/,/g, '')) * -1).toString();
    setDisplay(newValue);
  };
  
  const handlePercentClick = () => {
    if (display === 'Error') return;
    const currentValue = parseFloat(display.replace(/,/g, ''));
    let newValue;

    if (previousValue && (operator === '+' || operator === '-')) {
      // Calculate percentage of the previous value
      const prev = parseFloat(previousValue.replace(/,/g, ''));
      newValue = (prev * currentValue / 100).toString();
    } else {
      // Default percentage calculation
      newValue = (currentValue / 100).toString();
    }
    
    setDisplay(newValue.slice(0, 15));
  };


  const performCalculation = () => {
    const prev = parseFloat(previousValue!.replace(/,/g, ''));
    const curr = parseFloat(display.replace(/,/g, ''));
    let result: number;

    switch (operator) {
      case '+':
        result = prev + curr;
        break;
      case '-':
        result = prev - curr;
        break;
      case '×':
        result = prev * curr;
        break;
      case '÷':
        if (curr === 0) {
          return 'Error';
        }
        result = prev / curr;
        break;
      default:
        return display;
    }
    return result.toString().slice(0, 15);
  };
  
  const handleOperatorClick = (nextOperator: string) => {
    if (display === 'Error') return;
    const currentDisplayValue = display.replace(/,/g, '');

    if (previousValue !== null && operator && !waitingForOperand) {
      const result = performCalculation();
      setDisplay(result);
      setPreviousValue(result);
      setHistory(`${formatNumber(result)} ${nextOperator}`);
    } else {
      setPreviousValue(currentDisplayValue);
      setHistory(`${formatNumber(currentDisplayValue)} ${nextOperator}`);
    }
    setWaitingForOperand(true);
    setOperator(nextOperator);
  };

  const handleEqualsClick = () => {
    if (previousValue === null || operator === null || waitingForOperand) {
      return;
    }
    const result = performCalculation();
    setHistory(`${formatNumber(previousValue)} ${operator} ${formatNumber(display)} =`);
    setDisplay(result);
    setPreviousValue(null);
    setOperator(null);
    setWaitingForOperand(true);
  };

  const handleClearClick = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperator(null);
    setWaitingForOperand(true);
    setHistory('');
  };

  const handleBackspaceClick = () => {
    if (waitingForOperand || display === 'Error') return;
    const newDisplay = display.length > 1 ? display.slice(0, -1) : '0';
    setDisplay(newDisplay);
    if (newDisplay === '0' || newDisplay === '-') {
      setWaitingForOperand(true);
    }
  };

  const buttons = [
    { label: 'C', handler: handleClearClick, type: 'clear' },
    { label: '+/-', handler: handleToggleSignClick, type: 'operator' },
    { label: '%', handler: handlePercentClick, type: 'operator' },
    { label: <Delete className="mx-auto h-5 w-5"/>, handler: handleBackspaceClick, type: 'operator' },
    
    { label: '7', handler: () => handleNumberClick('7'), type: 'number' },
    { label: '8', handler: () => handleNumberClick('8'), type: 'number' },
    { label: '9', handler: () => handleNumberClick('9'), type: 'number' },
    { label: '÷', handler: () => handleOperatorClick('÷'), type: 'operator' },
    
    { label: '4', handler: () => handleNumberClick('4'), type: 'number' },
    { label: '5', handler: () => handleNumberClick('5'), type: 'number' },
    { label: '6', handler: () => handleNumberClick('6'), type: 'number' },
    { label: '×', handler: () => handleOperatorClick('×'), type: 'operator' },

    { label: '1', handler: () => handleNumberClick('1'), type: 'number' },
    { label: '2', handler: () => handleNumberClick('2'), type: 'number' },
    { label: '3', handler: () => handleNumberClick('3'), type: 'number' },
    { label: '-', handler: () => handleOperatorClick('-'), type: 'operator' },
    
    { label: '0', handler: () => handleNumberClick('0'), type: 'number' },
    { label: '00', handler: () => handleNumberClick('00'), type: 'number' },
    { label: '.', handler: handleDecimalClick, type: 'number' },
    { label: '+', handler: () => handleOperatorClick('+'), type: 'operator' },

    { label: <Wallet className="mx-auto h-5 w-5"/>, handler: handleLoadCashFlow, type: 'operator', className: 'col-span-2' },
    { label: '=', handler: handleEqualsClick, type: 'equals', className: 'col-span-2' },
  ];

  const renderButtonLabel = (label: string | React.ReactElement) => {
    if (typeof label === 'string') {
      return label;
    }
    return label;
  }

  return (
    <Card className="w-full max-w-sm shadow-2xl border-2">
      <CardHeader>
        <div className="bg-muted text-right p-4 rounded-lg border">
          <p className="text-sm font-mono text-muted-foreground break-all" style={{ minHeight: '20px' }}>
            {history || ' '}
          </p>
          <p className="text-3xl font-mono text-foreground break-all" style={{ minHeight: '44px' }}>
            {formatNumber(display)}
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 pt-6">
        <div className="grid grid-cols-4 gap-2">
          {buttons.map(({ label, handler, type, className }, index) => (
            <Button
              key={index}
              onClick={handler}
              variant="outline"
              className={cn('text-xl h-16', {
                'bg-accent text-accent-foreground hover:bg-accent/90': type === 'operator',
                'bg-primary text-primary-foreground hover:bg-primary/90': type === 'equals',
                'bg-destructive/80 text-destructive-foreground hover:bg-destructive/90': type === 'clear',
              }, className)}
            >
              {renderButtonLabel(label)}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
