
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, BarChart3, Users, Globe, MapPin, CheckCircle2 } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold uppercase tracking-wider">
                <BarChart3 className="w-4 h-4" /> All-In-One Business System
              </div>
              <h1 className="text-5xl lg:text-7xl font-extrabold text-primary font-headline tracking-tight leading-tight">
                Manage your business in <span className="text-accent">one simple system.</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Stop juggling multiple tools. LocalSphere helps you manage your online presence, customers, and operations in a single, powerful platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register">
                  <Button size="lg" className="px-10 py-8 text-xl rounded-2xl shadow-xl hover:scale-105 transition-transform">
                    Start Managing Free <ArrowRight className="ml-2 w-6 h-6" />
                  </Button>
                </Link>
                <Link href="/services">
                  <Button size="lg" variant="outline" className="px-10 py-8 text-xl rounded-2xl bg-white/50 backdrop-blur-sm">
                    How it works
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          {/* Dashboard Preview Mockup */}
          <div className="mt-20 container mx-auto px-4">
            <div className="relative max-w-6xl mx-auto rounded-3xl overflow-hidden shadow-2xl border-8 border-white bg-accent/5">
              <img 
                src="https://picsum.photos/seed/dashboard-preview/1200/600" 
                alt="Dashboard Preview" 
                className="w-full h-auto opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            </div>
          </div>
        </section>

        {/* Core Value Props */}
        <section className="py-24 bg-accent/5">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                { 
                  icon: Users, 
                  title: "Customer Management", 
                  desc: "A built-in CRM to store customer info, track interactions, and grow your local loyalty." 
                },
                { 
                  icon: Globe, 
                  title: "Online Presence", 
                  desc: "Sync with Google Business Profile. Manage reviews, posts, and photos from one place." 
                },
                { 
                  icon: BarChart3, 
                  title: "Real-time Analytics", 
                  desc: "Clear visual reports on your business performance and customer growth trends." 
                }
              ].map((item, idx) => (
                <div key={idx} className="space-y-4 p-8 rounded-3xl bg-white shadow-sm border border-border/50">
                  <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-white">
                    <item.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-primary">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Simple Steps */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-4xl font-bold text-primary font-headline">Built for Local Excellence</h2>
              <p className="text-muted-foreground text-lg">Simplified management for physical businesses.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div className="space-y-8">
                {[
                  "Centralize your customer data",
                  "Automate your Google presence",
                  "Track daily operational metrics",
                  "Mobile-first management dashboard"
                ].map((step, idx) => (
                  <div key={idx} className="flex gap-4 items-center">
                    <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-primary font-bold">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <span className="text-xl font-medium text-primary">{step}</span>
                  </div>
                ))}
                <Link href="/register">
                  <Button size="lg" className="rounded-xl px-8 py-7 font-bold">Get Started Now</Button>
                </Link>
              </div>
              <div className="rounded-3xl bg-primary/10 aspect-video flex items-center justify-center border-4 border-dashed border-primary/20 p-12 text-center">
                 <div className="space-y-4">
                    <MapPin className="w-16 h-16 text-primary mx-auto opacity-50" />
                    <p className="text-2xl font-bold text-primary">"The only system you need to run your local shop successfully."</p>
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
