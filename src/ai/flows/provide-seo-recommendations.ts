'use server';
/**
 * @fileOverview Provides AI-driven, personalized recommendations for improving a local business's online presence.
 *
 * - provideSeoRecommendations - A function that generates tailored SEO recommendations.
 * - ProvideSeoRecommendationsInput - The input type for the provideSeoRecommendations function.
 * - ProvideSeoRecommendationsOutput - The return type for the provideSeoRecommendations function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ProvideSeoRecommendationsInputSchema = z.object({
  businessName: z.string().describe('The name of the business.'),
  businessDescription: z.string().describe('A brief description of the business, its services, and unique selling points.'),
  businessCategory: z.string().describe('The primary category or industry of the business (e.g., "Italian Restaurant", "Dentist Clinic", "Boutique Hotel").'),
  businessLocation: z.string().describe('The physical location of the business (city, state/region, country).'),
  checklistResults: z.array(z.string()).describe('A list of areas identified for improvement from the SEO readiness checklist. Each item should be a concise statement like "Google Business Profile not claimed" or "Website lacks mobile responsiveness".'),
});
export type ProvideSeoRecommendationsInput = z.infer<typeof ProvideSeoRecommendationsInputSchema>;

const ProvideSeoRecommendationsOutputSchema = z.object({
  recommendations: z.array(
    z.object({
      title: z.string().describe('A concise title for the recommendation.'),
      description: z.string().describe('A detailed explanation of why this recommendation is important and its benefits.'),
      priority: z.enum(['high', 'medium', 'low']).describe('The priority level for implementing this recommendation.'),
      actionableSteps: z.array(z.string()).describe('A list of concrete, actionable steps to implement the recommendation.'),
    })
  ).describe('A list of personalized SEO recommendations.'),
});
export type ProvideSeoRecommendationsOutput = z.infer<typeof ProvideSeoRecommendationsOutputSchema>;

export async function provideSeoRecommendations(input: ProvideSeoRecommendationsInput): Promise<ProvideSeoRecommendationsOutput> {
  return provideSeoRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'seoRecommendationsPrompt',
  input: { schema: ProvideSeoRecommendationsInputSchema },
  output: { schema: ProvideSeoRecommendationsOutputSchema },
  prompt: `You are an expert Local SEO strategist and a Google Business Profile optimization specialist.
Your goal is to provide highly personalized, actionable recommendations for improving a local business's online presence and local search ranking.

Here is the business information:
Business Name: {{{businessName}}}
Business Description: {{{businessDescription}}}
Business Category: {{{businessCategory}}}
Business Location: {{{businessLocation}}}

The following areas were identified as needing improvement from an SEO readiness checklist:
{{#each checklistResults}}- {{{this}}}
{{/each}}

Based on this information, generate a list of prioritized recommendations. Each recommendation should include a title, a detailed description of its importance, a priority level (high, medium, or low), and a list of concrete, actionable steps the business owner can take.
Focus on practical advice related to Google Business Profile, local SEO, website basics, and review management.
`,
});

const provideSeoRecommendationsFlow = ai.defineFlow(
  {
    name: 'provideSeoRecommendationsFlow',
    inputSchema: ProvideSeoRecommendationsInputSchema,
    outputSchema: ProvideSeoRecommendationsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
