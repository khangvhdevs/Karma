'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Delete } from 'lucide-react';

export default function Calculator() {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<string | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(true);

  const handleNumberClick = (num: string) => {
    if (display.length >= 12 && !waitingForOperand) return;

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

  const performCalculation = () => {
    const prev = parseFloat(previousValue!);
    const curr = parseFloat(display);
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
          return 'Lỗi';
        }
        result = prev / curr;
        break;
      default:
        return display;
    }
    return result.toString().slice(0, 12);
  };
  
  const handleOperatorClick = (nextOperator: string) => {
    if (previousValue !== null && operator && !waitingForOperand) {
      const result = performCalculation();
      setDisplay(result);
      setPreviousValue(result);
    } else {
      setPreviousValue(display);
    }
    setWaitingForOperand(true);
    setOperator(nextOperator);
  };

  const handleEqualsClick = () => {
    if (previousValue === null || operator === null || waitingForOperand) {
      return;
    }
    const result = performCalculation();
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
  };

  const handleBackspaceClick = () => {
    if (waitingForOperand) return;
    const newDisplay = display.length > 1 ? display.slice(0, -1) : '0';
    setDisplay(newDisplay);
    if (newDisplay === '0') {
      setWaitingForOperand(true);
    }
  };

  const buttons = [
    { label: 'C', handler: handleClearClick, type: 'clear', className: 'col-span-2' },
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
                'bg-primary text-primary-foreground hover:bg-primary/90': type === 'equals',
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
