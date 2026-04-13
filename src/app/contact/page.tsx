
"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin, Send, Loader2 } from "lucide-react";
import { useState } from "react";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Inquiry Sent!",
        description: "Our team will reach out to you within 24 hours.",
      });
      (e.target as HTMLFormElement).reset();
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-20 bg-accent/5">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-5xl font-extrabold text-primary font-headline">Let's Boost Your Local Presence</h1>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Ready to take your business to the next level? Fill out the form and our growth experts will prepare a custom proposal for you.
                </p>
              </div>

              <div className="space-y-6">
                {[
                  { icon: Mail, label: "Email Us", value: "growth@localsphere.com" },
                  { icon: Phone, label: "Call Us", value: "+251 900 000 000" },
                  { icon: MapPin, label: "Visit Us", value: "Bole, Addis Ababa, Ethiopia" },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-white shrink-0">
                      <item.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-muted-foreground">{item.label}</p>
                      <p className="text-lg font-bold text-primary">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-8 rounded-3xl bg-primary text-primary-foreground space-y-4">
                <h4 className="text-xl font-bold">What happens next?</h4>
                <ul className="space-y-3 text-sm opacity-90">
                  <li className="flex gap-2"><span>1.</span> <span>We review your business profile and location data.</span></li>
                  <li className="flex gap-2"><span>2.</span> <span>An expert calls you for a 15-minute discovery session.</span></li>
                  <li className="flex gap-2"><span>3.</span> <span>You get a tailored growth roadmap and pricing.</span></li>
                </ul>
              </div>
            </div>

            <Card className="shadow-2xl border-none rounded-3xl overflow-hidden">
              <CardHeader className="bg-primary text-primary-foreground p-8">
                <CardTitle className="text-2xl">Service Inquiry Form</CardTitle>
                <CardDescription className="text-primary-foreground/80">Tell us about your digital needs.</CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Full Name</label>
                      <Input placeholder="John Doe" required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Business Email</label>
                      <Input type="email" placeholder="john@company.com" required />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Business Name</label>
                    <Input placeholder="Local Sphere Cafe" required />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Desired Service</label>
                    <Select required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gbp">GBP Optimization</SelectItem>
                        <SelectItem value="seo">Local SEO Mastery</SelectItem>
                        <SelectItem value="web">Website Development</SelectItem>
                        <SelectItem value="full">Full Digital Dominance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">How can we help?</label>
                    <Textarea placeholder="Tell us about your current challenges..." className="min-h-[120px]" required />
                  </div>

                  <Button type="submit" size="lg" className="w-full py-7 text-lg rounded-xl font-bold" disabled={loading}>
                    {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Send className="w-5 h-5 mr-2" />}
                    Send My Inquiry
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
