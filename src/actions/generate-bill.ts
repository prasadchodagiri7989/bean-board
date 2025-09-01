'use server';

import { generateDetailedBill } from '@/ai/flows/generate-detailed-bill';
import type { OrderItem } from '@/lib/types';
import { z } from 'zod';

const GenerateBillInputSchema = z.object({
  orderItems: z.array(
    z.object({
      name: z.string(),
      price: z.number(),
      quantity: z.number(),
    })
  ),
  salesTaxRate: z.number(),
});

export async function generateBillAction(
  input: z.infer<typeof GenerateBillInputSchema>
): Promise<{ billDetails: string } | { error: string }> {
  const validatedInput = GenerateBillInputSchema.safeParse(input);

  if (!validatedInput.success) {
    return { error: 'Invalid input.' };
  }

  try {
    const result = await generateDetailedBill({
      orderItems: validatedInput.data.orderItems,
      salesTaxRate: validatedInput.data.salesTaxRate,
      customerHistory: 'Regular customer, occasionally orders pastries.',
      ongoingPromotions: '10% off on all coffee drinks on weekdays.',
    });
    return result;
  } catch (e) {
    console.error(e);
    return { error: 'Failed to generate bill using AI.' };
  }
}
