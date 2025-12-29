import Header from '@/components/header';
import CashFlowCalculator, { handleReset } from '@/components/cash-flow-calculator';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Calculator, RotateCcw } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

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
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full">
                  <RotateCcw className="mr-2 h-5 w-5" />
                  Đặt lại
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Bạn có chắc chắn muốn đặt lại?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Hành động này sẽ xóa tất cả dữ liệu tài chính hiện tại của bạn và đặt lại về giá trị mặc định. Bạn sẽ không thể hoàn tác hành động này.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Hủy</AlertDialogCancel>
                  <AlertDialogAction onClick={handleReset}>Tiếp tục</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </main>
    </div>
  );
}
