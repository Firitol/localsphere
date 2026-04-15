
"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Pricing } from "@/components/home/Pricing";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="bg-accent/5 py-24">
          <div className="container mx-auto px-4 text-center space-y-4">
            <h1 className="text-4xl lg:text-6xl font-extrabold font-headline text-primary">Simple Pricing, Real Results</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              No hidden fees. No long-term contracts. Just growth for your local business.
            </p>
          </div>
        </section>

        <Pricing />

        <section className="py-24 bg-white">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-3xl font-bold text-center mb-12 font-headline">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>How long does it take to see results?</AccordionTrigger>
                <AccordionContent>
                  While GBP setup is instant, Local SEO typically takes 30-90 days to show significant ranking improvements as Google indexes your optimized profile.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Can I cancel my monthly plan anytime?</AccordionTrigger>
                <AccordionContent>
                  Yes, we believe in earning your business every month. There are no cancellation fees or lock-in contracts for our Growth Monthly plan.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>What is included in the "Full Digital Dominance" plan?</AccordionTrigger>
                <AccordionContent>
                  This is a bespoke strategy that includes a custom high-performance website, advanced backlink strategy, automated review harvesting, and managed local ads.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>Do you offer discounts for multiple locations?</AccordionTrigger>
                <AccordionContent>
                  Absolutely! Businesses with more than 3 locations are eligible for our enterprise-tier pricing. Contact us for a custom quote.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
