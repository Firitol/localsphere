'use server';
/**
 * @fileOverview A Genkit flow for generating Google Business Profile content such as descriptions,
 * service lists, and promotional posts based on business details.
 *
 * - generateGbpContent - A function that handles the content generation process.
 * - GenerateGbpContentInput - The input type for the generateGbpContent function.
 * - GenerateGbpContentOutput - The return type for the generateGbpContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateGbpContentInputSchema = z.object({
  businessName: z.string().describe('The name of the business.'),
  businessDescription: z
    .string()
    .describe('A detailed description of what the business does and offers.'),
  servicesOffered: z
    .array(z.string())
    .describe('A list of services the business provides.'),
  targetAudience: z
    .string()
    .describe('The primary target audience for the business.'),
  toneOfVoice: z
    .string()
    .describe(
      'The desired tone of voice for the content (e.g., professional, friendly, innovative).'
    ),
  currentPromotions: z
    .string()
    .optional()
    .describe('Any current promotions or special offers the business has.'),
});
export type GenerateGbpContentInput = z.infer<
  typeof GenerateGbpContentInputSchema
>;

const GenerateGbpContentOutputSchema = z.object({
  gbpDescription: z
    .string()
    .describe('A compelling and concise description for Google Business Profile.'),
  gbpServices: z
    .array(
      z.object({
        name: z.string().describe('The name of the service.'),
        description: z
          .string()
          .describe('A short description of the service for Google Business Profile.'),
      })
    )
    .describe('A list of services with their descriptions optimized for GBP.'),
  promotionalPost: z
    .string()
    .describe('A short, engaging promotional post for Google Business Profile updates.'),
});
export type GenerateGbpContentOutput = z.infer<
  typeof GenerateGbpContentOutputSchema
>;

const prompt = ai.definePrompt({
  name: 'generateGbpContentPrompt',
  input: { schema: GenerateGbpContentInputSchema },
  output: { schema: GenerateGbpContentOutputSchema },
  prompt: `You are an expert marketing strategist specializing in Google Business Profile (GBP) optimization for local businesses. Your task is to generate compelling content for a business based on the provided details.\n\nPlease generate the following:\n1.  A concise and engaging Google Business Profile description.\n2.  A list of services, each with a brief description, suitable for GBP.\n3.  A short, attention-grabbing promotional post for GBP updates.\n\nUse the following business information:\n\nBusiness Name: {{{businessName}}}\nBusiness Description: {{{businessDescription}}}\nServices Offered:\n{{#each servicesOffered}}- {{{this}}}\n{{/each}}\nTarget Audience: {{{targetAudience}}}\nTone of Voice: {{{toneOfVoice}}}\n{{#if currentPromotions}}Current Promotions: {{{currentPromotions}}}{{/if}}\n\nEnsure the content is optimized for discoverability and engagement on Google Business Profile. The promotional post should encourage action or provide value to potential customers.\n`,
});

const generateGbpContentFlow = ai.defineFlow(
  {
    name: 'generateGbpContentFlow',
    inputSchema: GenerateGbpContentInputSchema,
    outputSchema: GenerateGbpContentOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);

export async function generateGbpContent(
  input: GenerateGbpContentInput
): Promise<GenerateGbpContentOutput> {
  return generateGbpContentFlow(input);
}
