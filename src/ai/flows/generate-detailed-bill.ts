'use server';

/**
 * @fileOverview AI agent that generates a detailed bill for a table, incorporating sales tax and suggesting potential discounts.
 *
 * - generateDetailedBill - A function that handles the bill generation process.
 * - GenerateDetailedBillInput - The input type for the generateDetailedBill function.
 * - GenerateDetailedBillOutput - The return type for the generateDetailedBill function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDetailedBillInputSchema = z.object({
  orderItems: z.array(
    z.object({
      name: z.string().describe('The name of the item.'),
      price: z.number().describe('The price of the item.'),
      quantity: z.number().describe('The quantity of the item.'),
    })
  ).describe('A list of items in the order.'),
  salesTaxRate: z.number().describe('The sales tax rate to apply to the order.'),
  customerHistory: z.string().optional().describe('The customer purchase history to suggest potential discounts.'),
  ongoingPromotions: z.string().optional().describe('Details about ongoing promotions that could be applied.'),
});
export type GenerateDetailedBillInput = z.infer<typeof GenerateDetailedBillInputSchema>;

const GenerateDetailedBillOutputSchema = z.object({
  billDetails: z.string().describe('A detailed bill including itemized costs, sales tax, potential discounts, and total amount due.'),
});
export type GenerateDetailedBillOutput = z.infer<typeof GenerateDetailedBillOutputSchema>;

export async function generateDetailedBill(input: GenerateDetailedBillInput): Promise<GenerateDetailedBillOutput> {
  return generateDetailedBillFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDetailedBillPrompt',
  input: {schema: GenerateDetailedBillInputSchema},
  output: {schema: GenerateDetailedBillOutputSchema},
  prompt: `You are an expert cashier assistant, skilled in generating detailed and attractive bills for customers.

  Given the following order details, sales tax rate, customer history, and ongoing promotions, generate a detailed bill that includes:
  - Itemized list of all items with their names, quantities, and prices.
  - Subtotal of all items before tax.
  - Sales tax amount, calculated using the provided salesTaxRate.
  - Any applicable discounts based on customer history or ongoing promotions.
  - Total amount due, including sales tax and discounts.

  Order Items:
  {{#each orderItems}}
  - {{name}} (Qty: {{quantity}}, Price: {{price}})
  {{/each}}

  Sales Tax Rate: {{salesTaxRate}}%
  Customer History: {{customerHistory}}
  Ongoing Promotions: {{ongoingPromotions}}

  Ensure the bill is easy to read and understand, providing a pleasant billing experience for the customer.
  `,
});

const generateDetailedBillFlow = ai.defineFlow(
  {
    name: 'generateDetailedBillFlow',
    inputSchema: GenerateDetailedBillInputSchema,
    outputSchema: GenerateDetailedBillOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
