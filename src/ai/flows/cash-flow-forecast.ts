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
  prompt: `You are a financial analyst tasked with forecasting cash flow trends.

Analyze the following historical income and expense data to forecast future cash flow trends for the specified time horizon.

Historical Data:
{{historicalData}}

Forecast Horizon: {{forecastHorizon}}

Provide a summary of the forecasted cash flow trends and the projected cash flow for the specified time horizon.
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
