import Header from '@/components/header';
import CashFlowCalculator, { handleReset } from '@/components/cash-flow-calculator';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Calculator, RotateCcw } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex flex-1 flex-col items-center p-4 md:p-6">
        <div className="w-full max-w-md space-y-6">
          <CashFlowCalculator />
          <div className="space-y-2">
            <Button asChild variant="secondary" className="w-full">
              <Link href="/calculator">
                <Calculator className="mr-2 h-5 w-5" />
                Mở Máy tính
              </Link>
            </Button>
            <Button onClick={handleReset} variant="destructive" className="w-full">
              <RotateCcw className="mr-2 h-5 w-5" />
              Đặt lại
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
