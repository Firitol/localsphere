
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { Services } from "@/components/home/Services";
import { Pricing } from "@/components/home/Pricing";
import { GbpContentGenerator } from "@/components/tools/GbpContentGenerator";
import { SeoChecklist } from "@/components/tools/SeoChecklist";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Sparkles, MapPin } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        
        {/* Features Preview / Tools Section */}
        <section className="py-24 bg-accent/5 overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-end justify-between gap-8 mb-16">
              <div className="space-y-4 max-w-2xl">
                <Badge className="bg-primary hover:bg-primary/90">Exclusive Free Tools</Badge>
                <h2 className="font-headline text-3xl lg:text-5xl font-bold text-primary">Try Our Growth Engines</h2>
                <p className="text-muted-foreground text-lg">
                  Get a taste of LocalSphere's power with our free AI tools and interactive checklists.
                </p>
              </div>
              <Link href="/tools">
                <Button variant="link" className="text-primary font-bold group">
                  View All Tools <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-24">
              <div className="space-y-12">
                <div className="flex items-center gap-4 border-b pb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                    <Sparkles className="text-white w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-primary">AI Google Profile Content Tool</h3>
                </div>
                <GbpContentGenerator />
              </div>

              <div className="space-y-12">
                <div className="flex items-center gap-4 border-b pb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                    <MapPin className="text-white w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-primary">Interactive SEO Checklist</h3>
                </div>
                <div className="max-w-5xl mx-auto w-full">
                  <SeoChecklist />
                </div>
              </div>
            </div>
          </div>
        </section>

        <Services />
        
        <section className="py-24 relative overflow-hidden bg-primary text-primary-foreground">
          <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
             <div className="grid grid-cols-12 gap-4 h-full">
               {Array.from({length: 48}).map((_, i) => (
                 <div key={i} className="border border-white/20" />
               ))}
             </div>
          </div>
          <div className="container mx-auto px-4 relative z-10 text-center space-y-8">
            <h2 className="font-headline text-3xl lg:text-5xl font-bold max-w-4xl mx-auto">
              Ready to claim your spot on the first page of local search?
            </h2>
            <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
              Join hundreds of business owners who trust LocalSphere to drive more customers to their physical and digital doors.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/contact">
                <Button size="lg" className="bg-accent text-primary font-bold px-12 py-8 rounded-2xl hover:bg-accent/90">
                  Book A Discovery Call
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" className="border-white/20 hover:bg-white/10 px-12 py-8 rounded-2xl text-white">
                  View Pricing Plans
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <Pricing />
      </main>
      <Footer />
    </div>
  );
}

function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-block px-3 py-1 text-xs font-bold uppercase tracking-widest rounded-full ${className}`}>
      {children}
    </span>
  );
}
