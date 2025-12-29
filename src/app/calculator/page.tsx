'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/header';
import Calculator from '@/components/calculator';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Wallet } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { Card } from '@/components/ui/card';

export default function CalculatorPage() {
  const [monthlyCashFlow, setMonthlyCashFlow] = useState<number>(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      try {
        const savedSalary = localStorage.getItem('cashflow-salary') || '0';
        const savedPassiveIncome = localStorage.getItem('cashflow-passiveIncome') || '0';
        const savedExpenses = localStorage.getItem('cashflow-expenses') || '0';

        const numSalary = parseFloat(savedSalary.replace(/,/g, '')) || 0;
        const numPassiveIncome = parseFloat(savedPassiveIncome.replace(/,/g, '')) || 0;
        const numExpenses = parseFloat(savedExpenses.replace(/,/g, '')) || 0;

        setMonthlyCashFlow(numSalary + numPassiveIncome - numExpenses);
      } catch (error) {
        console.error('Failed to read cash flow data from localStorage', error);
        setMonthlyCashFlow(0);
      }
    }
  }, [isClient]);

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex flex-1 flex-col items-center p-4 md:p-6">
        <div className="w-full max-w-sm space-y-4">
          <div className="flex justify-between items-center w-full">
            <Button asChild variant="outline">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Link>
            </Button>
            <Card className="flex items-center gap-2 p-2 px-3 border-2">
              <Wallet className="h-5 w-5 text-muted-foreground"/>
              <span className="font-bold text-lg">{isClient ? formatCurrency(monthlyCashFlow) : '...'}</span>
            </Card>
          </div>
          <Calculator />
        </div>
      </main>
    </div>
  );
}
