'use server';

/**
 * @fileOverview Cash flow forecast AI agent.
 *
 * - forecastCashFlow - A function that handles the cash flow forecast process.
 * - CashFlowForecastInput - The input type for the forecastCashFlow function.
 * - CashFlowForecastOutput - The return type for the forecastCashFlow function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CashFlowForecastInputSchema = z.object({
  historicalData: z
    .string()
    .describe(
      'Historical income and expense data, as a CSV string with columns: date, income, expenses.'
    ),
  forecastHorizon: z
    .string()
    .describe('The time horizon for the forecast, e.g., 3 months, 1 year.'),
});
export type CashFlowForecastInput = z.infer<typeof CashFlowForecastInputSchema>;

const CashFlowForecastOutputSchema = z.object({
  forecastSummary: z
    .string()
    .describe('A summary of the forecasted cash flow trends.'),
  projectedCashFlow: z
    .string()
    .describe('The projected cash flow for the specified time horizon.'),
});
export type CashFlowForecastOutput = z.infer<typeof CashFlowForecastOutputSchema>;

export async function forecastCashFlow(
  input: CashFlowForecastInput
): Promise<CashFlowForecastOutput> {
  return forecastCashFlowFlow(input);
}

const prompt = ai.definePrompt({
  name: 'cashFlowForecastPrompt',
  input: {schema: CashFlowForecastInputSchema},
  output: {schema: CashFlowForecastOutputSchema},
  prompt: `Bạn là một nhà phân tích tài chính có nhiệm vụ dự báo xu hướng dòng tiền.

Phân tích dữ liệu thu nhập và chi phí lịch sử sau đây để dự báo xu hướng dòng tiền trong tương lai cho khoảng thời gian được chỉ định.

Dữ liệu lịch sử:
{{historicalData}}

Khoảng thời gian dự báo: {{forecastHorizon}}

Cung cấp tóm tắt về xu hướng dòng tiền dự báo và dòng tiền dự kiến cho khoảng thời gian được chỉ định bằng tiếng Việt.
`,
});

const forecastCashFlowFlow = ai.defineFlow(
  {
    name: 'forecastCashFlowFlow',
    inputSchema: CashFlowForecastInputSchema,
    outputSchema: CashFlowForecastOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
