'use server';
/**
 * @fileOverview An AI agent that analyzes Google Business Profile data and generates a concise summary of its strengths, weaknesses, and actionable improvement suggestions.
 *
 * - summarizeGbpAudit - A function that handles the GBP audit summarization process.
 * - SummarizeGbpAuditInput - The input type for the summarizeGbpAudit function.
 * - SummarizeGbpAuditOutput - The return type for the summarizeGbpAudit function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SummarizeGbpAuditInputSchema = z.object({
  businessName: z.string().describe('The name of the business being audited.'),
  location: z.string().describe('The geographical location of the business.'),
  overallRating: z.number().describe('The overall star rating of the business on Google Business Profile.'),
  totalReviews: z.number().describe('The total number of reviews received.'),
  categories: z.array(z.string()).describe('A list of categories associated with the business.'),
  address: z.string().describe('The full address of the business.'),
  phoneNumber: z.string().optional().describe('The primary phone number of the business.'),
  website: z.string().optional().describe('The official website URL of the business.'),
  reviews: z.array(z.string()).describe('A list of recent review texts for the business.'),
}).describe('Input data for summarizing a Google Business Profile audit.');

export type SummarizeGbpAuditInput = z.infer<typeof SummarizeGbpAuditInputSchema>;

const SummarizeGbpAuditOutputSchema = z.object({
  strengths: z.array(z.string()).describe('A list of strong points of the Google Business Profile.'),
  weaknesses: z.array(z.string()).describe('A list of areas where the Google Business Profile can improve.'),
  suggestions: z.array(z.string()).describe('A list of actionable recommendations for improving the profile.'),
}).describe('Output summary of the Google Business Profile audit.');

export type SummarizeGbpAuditOutput = z.infer<typeof SummarizeGbpAuditOutputSchema>;

export async function summarizeGbpAudit(input: SummarizeGbpAuditInput): Promise<SummarizeGbpAuditOutput> {
  return summarizeGbpAuditFlow(input);
}

const summarizeGbpAuditPrompt = ai.definePrompt({
  name: 'summarizeGbpAuditPrompt',
  input: { schema: SummarizeGbpAuditInputSchema },
  output: { schema: SummarizeGbpAuditOutputSchema },
  prompt: `You are an expert in local SEO and Google Business Profile (GBP) optimization. Your task is to analyze the provided business information and GBP data to generate a concise summary of its strengths, weaknesses, and actionable improvement suggestions.

Business Name: {{{businessName}}}
Location: {{{location}}}
Overall Rating: {{{overallRating}}} stars
Total Reviews: {{{totalReviews}}}
Categories: {{{categories.join ", "}}}
Address: {{{address}}}
{{#if phoneNumber}}Phone Number: {{{phoneNumber}}}{{/if}}
{{#if website}}Website: {{{website}}}{{/if}}
Recent Reviews:
{{#each reviews}}- {{{this}}}
{{/each}}

Based on the above data, provide an analysis focusing on:
1.  **Strengths**: What are the positive aspects of this Google Business Profile?
2.  **Weaknesses**: What are the areas where the profile is underperforming or could be improved?
3.  **Actionable Suggestions**: Provide specific, concrete steps the business can take to improve its online presence and GBP performance.

Ensure the output is strictly in the specified JSON format.`,
});

const summarizeGbpAuditFlow = ai.defineFlow(
  {
    name: 'summarizeGbpAuditFlow',
    inputSchema: SummarizeGbpAuditInputSchema,
    outputSchema: SummarizeGbpAuditOutputSchema,
  },
  async (input) => {
    const { output } = await summarizeGbpAuditPrompt(input);
    return output!;
  }
);
