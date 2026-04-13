
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Search, MapPin, Zap } from "lucide-react";

export function Hero() {
  const heroImg = PlaceHolderImages.find(img => img.id === "hero-image");

  return (
    <section className="relative overflow-hidden py-20 lg:py-32">
      <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 text-primary border border-accent/30 text-xs font-bold uppercase tracking-wider">
            <Zap className="w-3 h-3 fill-accent" /> Scalable Local Growth
          </div>
          <h1 className="font-headline text-4xl lg:text-6xl font-extrabold text-primary leading-tight">
            Dominating Local Search <span className="text-accent">Made Simple.</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
            We help local businesses scale from visible to dominant. Optimized Google Business Profiles, expert Local SEO, and stunning digital presence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="px-8 py-6 text-lg rounded-xl shadow-lg hover:scale-105 transition-transform">
              Explore Services
            </Button>
            <Button size="lg" variant="outline" className="px-8 py-6 text-lg rounded-xl bg-white/50 backdrop-blur-sm">
              Free Audit Tool
            </Button>
          </div>
          <div className="flex items-center gap-4 pt-4 text-sm text-muted-foreground">
            <div className="flex -space-x-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-muted flex items-center justify-center overflow-hidden">
                  <img src={`https://picsum.photos/seed/${i+10}/32/32`} alt="user" />
                </div>
              ))}
            </div>
            <span>Trusted by 500+ Local Businesses</span>
          </div>
        </div>
        
        <div className="relative animate-in fade-in slide-in-from-right-8 duration-700">
          <div className="absolute -z-10 -top-20 -right-20 w-80 h-80 bg-accent/20 rounded-full blur-3xl" />
          <div className="absolute -z-10 -bottom-20 -left-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border-8 border-white">
            <Image 
              src={heroImg?.imageUrl || ""} 
              alt={heroImg?.description || "Hero"} 
              width={1200}
              height={800}
              className="object-cover w-full h-auto"
              data-ai-hint="digital workspace"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
