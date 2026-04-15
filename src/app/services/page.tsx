
"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Services } from "@/components/home/Services";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function ServicesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="bg-primary text-primary-foreground py-24">
          <div className="container mx-auto px-4 text-center space-y-6">
            <h1 className="text-4xl lg:text-6xl font-extrabold font-headline">Digital Domination Services</h1>
            <p className="text-xl text-primary-foreground/70 max-w-2xl mx-auto">
              We provide the tools and strategy needed for local businesses to thrive in a digital-first world.
            </p>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <Services />
          </div>
        </section>

        <section className="py-20 bg-accent/5">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <h2 className="text-3xl lg:text-5xl font-bold text-primary font-headline">Why Choose LocalSphere?</h2>
                <div className="space-y-6">
                  {[
                    { title: "AI-Powered Efficiency", desc: "Our tools use the latest Gemini models to automate content and analysis." },
                    { title: "Local First Strategy", desc: "We focus specifically on the signals that drive local foot traffic and maps ranking." },
                    { title: "Transparent Reporting", desc: "No vanity metrics. We focus on reviews, clicks, and calls that grow your business." }
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="mt-1">
                        <CheckCircle2 className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <h4 className="font-bold text-xl">{item.title}</h4>
                        <p className="text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Link href="/contact">
                  <Button size="lg" className="rounded-xl px-8 py-7 text-lg font-bold">
                    Start Your Growth Journey <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>
              <div className="relative">
                <div className="aspect-square bg-primary/10 rounded-3xl flex items-center justify-center border-4 border-dashed border-primary/20 p-12 text-center">
                  <p className="text-2xl font-bold text-primary italic">"Our mission is to ensure no local business is left behind in the search results."</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
