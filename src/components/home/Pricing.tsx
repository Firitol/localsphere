
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "Foundation",
    price: "$299",
    billing: "One-time setup",
    description: "Perfect for new businesses getting on the map.",
    features: [
      "GBP Setup & Verification",
      "Core NAP Audit",
      "5 High-Authority Citations",
      "SEO Basics Checklist",
      "3 Optimized Social Posts"
    ],
    buttonText: "Start Setup",
    highlight: false
  },
  {
    name: "Growth Monthly",
    price: "$149",
    billing: "per month",
    description: "Our most popular plan for scaling traffic.",
    features: [
      "Monthly GBP Optimization",
      "Weekly Content Updates",
      "Review Management",
      "Local Keyword Tracking",
      "24/7 Support"
    ],
    buttonText: "Join Growth",
    highlight: true
  },
  {
    name: "Dominance",
    price: "Custom",
    billing: "Bespoke strategy",
    description: "Full-scale digital takeover for large entities.",
    features: [
      "Advanced Local SEO",
      "Full Website Development",
      "Premium Ad Campaigns",
      "White-Glove Management",
      "Bi-Weekly Strategy Calls"
    ],
    buttonText: "Contact Us",
    highlight: false
  }
];

export function Pricing() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="font-headline text-3xl lg:text-5xl font-bold text-primary">Simple, Transparent Pricing</h2>
          <p className="text-muted-foreground text-lg">
            Choose the plan that fits your business stage. No hidden fees, just growth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, idx) => (
            <div 
              key={idx} 
              className={`relative p-8 rounded-3xl border transition-all duration-300 hover:-translate-y-2 ${plan.highlight ? 'border-accent bg-white shadow-2xl scale-105' : 'border-border bg-white shadow-sm'}`}
            >
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent text-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                  Recommended
                </div>
              )}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-primary mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-primary">{plan.price}</span>
                  <span className="text-muted-foreground text-sm">{plan.billing}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-4">{plan.description}</p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, fIdx) => (
                  <li key={fIdx} className="flex items-start gap-3 text-sm">
                    <Check className="w-5 h-5 text-accent shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link href="/contact">
                <Button className={`w-full py-6 rounded-xl font-bold ${plan.highlight ? 'bg-primary' : 'variant-outline'}`} variant={plan.highlight ? 'default' : 'outline'}>
                  {plan.buttonText}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
