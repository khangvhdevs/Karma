'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { forecastCashFlow, type CashFlowForecastOutput } from '@/ai/flows/cash-flow-forecast';
import { BrainCircuit, Bot, LineChart } from 'lucide-react';

interface CashFlowForecastProps {
  totalIncome: number;
  expenses: number;
}

export default function CashFlowForecast({ totalIncome, expenses }: CashFlowForecastProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CashFlowForecastOutput | null>(null);
  const [horizon, setHorizon] = useState('3 months');
  const { toast } = useToast();

  const generateHistoricalData = () => {
    let csv = 'date,income,expenses\n';
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const randomFactor = 1 + (Math.random() - 0.5) * 0.1; // +/- 5% variance
      const monthIncome = Math.round(totalIncome * randomFactor);
      const monthExpenses = Math.round(expenses * randomFactor);
      csv += `${date.toISOString().split('T')[0]},${monthIncome},${monthExpenses}\n`;
    }
    return csv;
  };

  const handleForecast = async () => {
    setLoading(true);
    setResult(null);
    try {
      const historicalData = generateHistoricalData();
      const forecastResult = await forecastCashFlow({
        historicalData,
        forecastHorizon: horizon,
      });
      setResult(forecastResult);
    } catch (error) {
      console.error('AI Forecast Error:', error);
      toast({
        variant: 'destructive',
        title: 'Ôi! Đã có lỗi xảy ra.',
        description: 'Không thể tạo dự báo AI. Vui lòng thử lại sau.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg" className="w-full text-accent-foreground bg-accent hover:bg-accent/90 border-accent-foreground/20 text-base">
          <BrainCircuit className="mr-2 h-5 w-5" />
          Nhận dự báo dòng tiền bằng AI
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-headline"><Bot /> Dự báo dòng tiền bằng AI</DialogTitle>
          <DialogDescription>
            Phân tích tài chính của bạn và dự báo xu hướng dòng tiền trong tương lai. Chọn một khoảng thời gian dự báo và chạy phân tích.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <Select value={horizon} onValueChange={setHorizon}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn khoảng thời gian dự báo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3 months">3 tháng</SelectItem>
              <SelectItem value="6 months">6 tháng</SelectItem>
              <SelectItem value="1 year">1 năm</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={handleForecast} disabled={loading} className="w-full">
            {loading ? 'Đang phân tích...' : 'Chạy dự báo'}
          </Button>
        </div>

        {loading && (
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        )}

        {result && (
          <div className="space-y-4 animate-in fade-in-50">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2"><LineChart /> Tóm tắt dự báo</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{result.forecastSummary}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Dòng tiền dự kiến</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-mono bg-muted p-3 rounded-md whitespace-pre-wrap">{result.projectedCashFlow}</p>
              </CardContent>
            </Card>
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Đóng</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
