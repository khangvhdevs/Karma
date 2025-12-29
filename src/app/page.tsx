import Header from '@/components/header';
import CashFlowCalculator from '@/components/cash-flow-calculator';

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex flex-1 flex-col items-center p-4 md:p-6">
        <div className="w-full max-w-md space-y-6">
          <CashFlowCalculator />
        </div>
      </main>
    </div>
  );
}
