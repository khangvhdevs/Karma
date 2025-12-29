'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Wallet, Delete, PawPrintIcon } from 'lucide-react';
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

  const handleVibrate = () => {
    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(50);
    }
  };

  const wrapWithVibration = <T extends (...args: any[]) => any>(fn: T): T => {
    return ((...args: Parameters<T>) => {
      handleVibrate();
      return fn(...args);
    }) as T;
  };

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

  const handleLoadCashFlow = wrapWithVibration(() => {
    if (isClient) {
      const cashFlow = getMonthlyCashFlow();
      setDisplay(cashFlow.toString());
      setWaitingForOperand(false);
    }
  });

  const handleNumberClick = wrapWithVibration((num: string) => {
    if (display.length >= 15 && !waitingForOperand) return;

    if (waitingForOperand) {
      setDisplay(num);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  });

  const handleDecimalClick = wrapWithVibration(() => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
      return;
    }
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  });
  
  const handleToggleSignClick = wrapWithVibration(() => {
    if (display === '0' || display === 'Error') return;
    const newValue = (parseFloat(display.replace(/,/g, '')) * -1).toString();
    setDisplay(newValue);
  });
  
  const handlePercentClick = wrapWithVibration(() => {
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
  });

  const handleIRClick = wrapWithVibration(() => {
    if (display === 'Error') return;
    
    let newValue: string;
    if (previousValue && operator && waitingForOperand) {
      const prev = parseFloat(previousValue);
      newValue = Math.round(prev * 0.1).toString();
      setHistory(`${formatNumber(previousValue)} ${operator} ${formatNumber(newValue)}`);
    } else {
      const currentValue = parseFloat(display.replace(/,/g, ''));
      newValue = Math.round(currentValue * 1.1).toString();
      setHistory('');
    }

    setDisplay(newValue.slice(0, 15));
    setWaitingForOperand(false);
  });

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
  
  const handleOperatorClick = wrapWithVibration((nextOperator: string) => {
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
  });

  const handleEqualsClick = wrapWithVibration(() => {
    if (previousValue === null || operator === null || waitingForOperand) {
      return;
    }
    const result = performCalculation();
    setHistory(`${formatNumber(previousValue)} ${operator} ${formatNumber(display)} =`);
    setDisplay(result);
    setPreviousValue(null);
    setOperator(null);
    setWaitingForOperand(true);
  });

  const handleClearClick = wrapWithVibration(() => {
    setDisplay('0');
    setPreviousValue(null);
    setOperator(null);
    setWaitingForOperand(true);
    setHistory('');
  });

  const handleBackspaceClick = wrapWithVibration(() => {
    if (waitingForOperand || display === 'Error') return;
    const newDisplay = display.length > 1 ? display.slice(0, -1) : '0';
    setDisplay(newDisplay);
    if (newDisplay === '0' || newDisplay === '-') {
      setWaitingForOperand(true);
    }
  });
  
  const buttons = [
    { label: 'C', handler: handleClearClick, className: 'bg-destructive/80 text-destructive-foreground hover:bg-destructive/90' },
    { label: '+/-', handler: handleToggleSignClick, className: 'bg-accent text-accent-foreground hover:bg-accent/90' },
    { label: '%', handler: handlePercentClick, className: 'bg-accent text-accent-foreground hover:bg-accent/90' },
    { label: '÷', handler: () => handleOperatorClick('÷'), className: 'bg-accent text-accent-foreground hover:bg-accent/90' },

    { label: '7', handler: () => handleNumberClick('7') },
    { label: '8', handler: () => handleNumberClick('8') },
    { label: '9', handler: () => handleNumberClick('9') },
    { label: '×', handler: () => handleOperatorClick('×'), className: 'bg-accent text-accent-foreground hover:bg-accent/90' },
    
    { label: '4', handler: () => handleNumberClick('4') },
    { label: '5', handler: () => handleNumberClick('5') },
    { label: '6', handler: () => handleNumberClick('6') },
    { label: '-', handler: () => handleOperatorClick('-'), className: 'bg-accent text-accent-foreground hover:bg-accent/90' },

    { label: '1', handler: () => handleNumberClick('1') },
    { label: '2', handler: () => handleNumberClick('2') },
    { label: '3', handler: () => handleNumberClick('3') },
    { label: '+', handler: () => handleOperatorClick('+'), className: 'bg-accent text-accent-foreground hover:bg-accent/90' },
    
    { label: '0', handler: () => handleNumberClick('0'), className: 'col-span-2' },
    { label: '.', handler: handleDecimalClick },
    { label: '=', handler: handleEqualsClick, className: 'bg-primary text-primary-foreground hover:bg-primary/90' },
  ];
  
  const topButtons = [
    { label: <Wallet className="mx-auto h-5 w-5"/>, handler: handleLoadCashFlow, className: 'bg-accent text-accent-foreground hover:bg-accent/90' },
    { label: 'IR', handler: handleIRClick, className: 'bg-accent text-accent-foreground hover:bg-accent/90' },
    { label: <PawPrintIcon className="mx-auto h-5 w-5"/>, className: 'bg-accent text-accent-foreground hover:bg-accent/90' },
    { label: <Delete className="mx-auto h-5 w-5"/>, handler: handleBackspaceClick, className: 'bg-accent text-accent-foreground hover:bg-accent/90' },
  ];

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
      <CardContent className="pt-6">
        <div className="grid grid-cols-4 gap-2">
          {topButtons.map((button, index) => (
            <Button
              key={`top-${index}`}
              onClick={button.handler}
              variant="outline"
              className={cn('text-xl h-16', button.className)}
            >
              {button.label}
            </Button>
          ))}
          {buttons.map((button, index) => (
            <Button
              key={index}
              onClick={button.handler}
              variant="outline"
              className={cn('text-xl h-16', button.className)}
            >
              {button.label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
