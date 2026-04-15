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
import { useFirestore } from "@/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const db = useFirestore();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const inquiryData = {
      name: formData.get("name"),
      email: formData.get("email"),
      businessName: formData.get("businessName"),
      service: formData.get("service"),
      message: formData.get("message"),
      createdAt: serverTimestamp(),
    };

    addDoc(collection(db, "inquiries"), inquiryData)
      .then(() => {
        setLoading(false);
        toast({
          title: "Inquiry Sent!",
          description: "Our team will reach out to you within 24 hours.",
        });
        (e.target as HTMLFormElement).reset();
      })
      .catch(async (error) => {
        setLoading(false);
        const permissionError = new FirestorePermissionError({
          path: 'inquiries',
          operation: 'create',
          requestResourceData: inquiryData,
        });
        errorEmitter.emit('permission-error', permissionError);
      });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-10 lg:py-20 bg-accent/5">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
            <div className="space-y-8">
              <div className="space-y-4 text-center lg:text-left">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-primary font-headline leading-tight">
                  Let's Boost Your <span className="text-accent">Local Presence</span>
                </h1>
                <p className="text-base lg:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto lg:mx-0">
                  Ready to take your business to the next level? Fill out the form and our growth experts will prepare a custom proposal for you.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
                {[
                  { icon: Mail, label: "Email Us", value: "growth@localsphere.com" },
                  { icon: Phone, label: "Call Us", value: "+251 900 000 000" },
                  { icon: MapPin, label: "Visit Us", value: "Bole, Addis Ababa, Ethiopia", fullWidth: true },
                ].map((item, idx) => (
                  <div key={idx} className={`flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm border border-border/50 transition-all hover:shadow-md hover:border-accent/30 ${item.fullWidth ? 'sm:col-span-2 lg:col-span-1' : ''}`}>
                    <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-primary flex items-center justify-center text-white shrink-0">
                      <item.icon className="w-5 h-5 lg:w-6 lg:h-6" />
                    </div>
                    <div>
                      <p className="text-[10px] lg:text-xs font-bold text-muted-foreground uppercase tracking-wider">{item.label}</p>
                      <p className="text-sm lg:text-lg font-bold text-primary truncate max-w-[200px] sm:max-w-none">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 lg:p-8 rounded-3xl bg-primary text-primary-foreground space-y-4 shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                  <Send className="w-12 h-12 lg:w-16 lg:h-16" />
                </div>
                <h4 className="text-lg lg:text-xl font-bold relative z-10">What happens next?</h4>
                <ul className="space-y-3 text-sm opacity-90 relative z-10">
                  <li className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0 text-xs">1</span>
                    <span>We review your business profile and location data.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0 text-xs">2</span>
                    <span>An expert calls you for a 15-minute discovery session.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0 text-xs">3</span>
                    <span>You get a tailored growth roadmap and pricing.</span>
                  </li>
                </ul>
              </div>
            </div>

            <Card className="shadow-2xl border-none rounded-3xl overflow-hidden">
              <CardHeader className="bg-primary text-primary-foreground p-6 lg:p-8">
                <CardTitle className="text-xl lg:text-2xl">Service Inquiry Form</CardTitle>
                <CardDescription className="text-primary-foreground/80">Tell us about your digital needs.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 lg:p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Full Name</label>
                      <Input name="name" className="rounded-xl h-11" placeholder="John Doe" required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Business Email</label>
                      <Input name="email" type="email" className="rounded-xl h-11" placeholder="john@company.com" required />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Business Name</label>
                    <Input name="businessName" className="rounded-xl h-11" placeholder="Local Sphere Cafe" required />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Desired Service</label>
                    <Select name="service" required>
                      <SelectTrigger className="rounded-xl h-11">
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="GBP Optimization">GBP Optimization</SelectItem>
                        <SelectItem value="Local SEO Mastery">Local SEO Mastery</SelectItem>
                        <SelectItem value="Website Development">Website Development</SelectItem>
                        <SelectItem value="Full Digital Dominance">Full Digital Dominance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">How can we help?</label>
                    <Textarea name="message" placeholder="Tell us about your current challenges..." className="min-h-[120px] rounded-xl resize-none" required />
                  </div>

                  <Button type="submit" size="lg" className="w-full py-7 text-lg rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform" disabled={loading}>
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