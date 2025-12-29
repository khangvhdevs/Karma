'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Delete } from 'lucide-react';

export default function Calculator() {
  const [display, setDisplay] = useState('0');
  const [currentValue, setCurrentValue] = useState<string | null>(null);
  const [previousValue, setPreviousValue] = useState<string | null>(null);
  const [operator, setOperator] = useState<string | null>(null);

  const handleNumberClick = (num: string) => {
    if (display.length >= 12) return;
    if (operator && currentValue === display) {
      setDisplay(num);
      setCurrentValue(num);
    } else {
      const newDisplay = display === '0' ? num : display + num;
      setDisplay(newDisplay);
      setCurrentValue(newDisplay);
    }
  };

  const handleOperatorClick = (op: string) => {
    if (previousValue && operator && currentValue) {
      handleEqualsClick();
      setPreviousValue(display);
    } else {
      setPreviousValue(display);
    }
    setCurrentValue(display);
    setOperator(op);
  };

  const handleEqualsClick = () => {
    if (!operator || previousValue === null || currentValue === null) return;
    const prev = parseFloat(previousValue);
    const curr = parseFloat(currentValue);
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
        result = prev / curr;
        break;
      default:
        return;
    }

    const resultString = result.toString().slice(0, 12);
    setDisplay(resultString);
    setPreviousValue(resultString);
    setCurrentValue(null);
    setOperator(null);
  };

  const handleClearClick = () => {
    setDisplay('0');
    setCurrentValue(null);
    setPreviousValue(null);
    setOperator(null);
  };

  const handleBackspaceClick = () => {
    const newDisplay = display.length > 1 ? display.slice(0, -1) : '0';
    setDisplay(newDisplay);
    setCurrentValue(newDisplay);
  };
  
  const handleDecimalClick = () => {
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const buttons = [
    { label: 'C', handler: handleClearClick, type: 'clear' },
    { label: <Delete />, handler: handleBackspaceClick, type: 'operator' },
    { label: '÷', handler: () => handleOperatorClick('÷'), type: 'operator' },
    { label: '7', handler: () => handleNumberClick('7'), type: 'number' },
    { label: '8', handler: () => handleNumberClick('8'), type: 'number' },
    { label: '9', handler: () => handleNumberClick('9'), type: 'number' },
    { label: '×', handler: () => handleOperatorClick('×'), type: 'operator' },
    { label: '4', handler: () => handleNumberClick('4'), type: 'number' },
    { label: '5', handler: () => handleNumberClick('5'), type: 'number' },
    { label: '6', handler: () => handleNumberClick('6'), type: 'number' },
    { label: '-', handler: () => handleOperatorClick('-'), type: 'operator' },
    { label: '1', handler: () => handleNumberClick('1'), type: 'number' },
    { label: '2', handler: () => handleNumberClick('2'), type: 'number' },
    { label: '3', handler: () => handleNumberClick('3'), type: 'number' },
    { label: '+', handler: () => handleOperatorClick('+'), type: 'operator' },
    { label: '0', handler: () => handleNumberClick('0'), type: 'number', className: 'col-span-2' },
    { label: '.', handler: handleDecimalClick, type: 'number' },
    { label: '=', handler: handleEqualsClick, type: 'equals' },
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
          <p className="text-3xl font-mono text-foreground break-all" style={{ minHeight: '44px' }}>
            {display}
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-2">
          {buttons.map(({ label, handler, type, className }, index) => (
            <Button
              key={index}
              onClick={handler}
              variant="outline"
              className={cn('text-xl h-16', className, {
                'bg-accent text-accent-foreground hover:bg-accent/90': type === 'operator',
                'bg-primary text-primary-foreground hover:bg-primary/90 col-span-4': type === 'equals',
                'bg-destructive/80 text-destructive-foreground hover:bg-destructive/90': type === 'clear',
              })}
            >
              {renderButtonLabel(label)}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
