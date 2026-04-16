"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle2 } from "lucide-react";
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
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 py-10 lg:py-20 bg-accent/5">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            
            {/* Left Content Column */}
            <div className="space-y-10 order-2 lg:order-1">
              <div className="space-y-6 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest">
                  Connect with experts
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-primary font-headline leading-[1.1]">
                  Let's Boost Your <span className="text-accent">Local Presence</span>
                </h1>
                <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium">
                  Ready to take your business to the next level? Fill out the form and our growth experts will prepare a custom proposal for you.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                {[
                  { icon: Mail, label: "Email Us", value: "growth@localsphere.com", color: "bg-blue-50 text-blue-600" },
                  { icon: Phone, label: "Call Us", value: "+251 900 000 000", color: "bg-emerald-50 text-emerald-600" },
                  { icon: MapPin, label: "Visit Us", value: "Bole, Addis Ababa, Ethiopia", fullWidth: true, color: "bg-amber-50 text-amber-600" },
                ].map((item, idx) => (
                  <div key={idx} className={`flex items-center gap-4 p-5 bg-white rounded-[24px] shadow-sm border border-slate-100 transition-all hover:shadow-md hover:border-accent/30 ${item.fullWidth ? 'sm:col-span-2' : ''}`}>
                    <div className={`w-12 h-12 rounded-2xl ${item.color} flex items-center justify-center shrink-0`}>
                      <item.icon className="w-6 h-6" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.label}</p>
                      <p className="text-sm lg:text-base font-bold text-primary truncate">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-8 lg:p-10 rounded-[32px] bg-slate-900 text-white space-y-6 shadow-2xl relative overflow-hidden group">
                <div className="absolute -top-10 -right-10 opacity-10 group-hover:scale-110 transition-transform duration-700">
                  <Send className="w-40 h-40" />
                </div>
                <h4 className="text-xl lg:text-2xl font-bold relative z-10 flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-accent" /> What happens next?
                </h4>
                <ul className="space-y-4 text-sm lg:text-base opacity-90 relative z-10">
                  <li className="flex gap-4 items-start">
                    <span className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center shrink-0 text-xs font-bold border border-primary/30">1</span>
                    <span className="text-slate-300">We review your business profile and location data.</span>
                  </li>
                  <li className="flex gap-4 items-start">
                    <span className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center shrink-0 text-xs font-bold border border-primary/30">2</span>
                    <span className="text-slate-300">An expert calls you for a 15-minute discovery session.</span>
                  </li>
                  <li className="flex gap-4 items-start">
                    <span className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center shrink-0 text-xs font-bold border border-primary/30">3</span>
                    <span className="text-slate-300">You get a tailored growth roadmap and pricing.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Form Column */}
            <div className="order-1 lg:order-2">
              <Card className="shadow-2xl border-none rounded-[40px] overflow-hidden lg:sticky lg:top-24">
                <CardHeader className="bg-primary text-primary-foreground p-8 lg:p-10 text-center sm:text-left">
                  <CardTitle className="text-2xl lg:text-3xl font-black">Inquiry Form</CardTitle>
                  <CardDescription className="text-primary-foreground/70 text-base font-medium">Tell us about your digital needs and we'll handle the rest.</CardDescription>
                </CardHeader>
                <CardContent className="p-8 lg:p-10">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Full Name</label>
                        <Input name="name" className="rounded-2xl h-12 bg-slate-50 border-slate-200 focus:bg-white transition-colors" placeholder="John Doe" required />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Business Email</label>
                        <Input name="email" type="email" className="rounded-2xl h-12 bg-slate-50 border-slate-200 focus:bg-white transition-colors" placeholder="john@company.com" required />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Business Name</label>
                      <Input name="businessName" className="rounded-2xl h-12 bg-slate-50 border-slate-200 focus:bg-white transition-colors" placeholder="Local Sphere Cafe" required />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Desired Service</label>
                      <Select name="service" required>
                        <SelectTrigger className="rounded-2xl h-12 bg-slate-50 border-slate-200 focus:bg-white">
                          <SelectValue placeholder="Select a service" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-slate-200">
                          <SelectItem value="GBP Optimization">GBP Optimization</SelectItem>
                          <SelectItem value="Local SEO Mastery">Local SEO Mastery</SelectItem>
                          <SelectItem value="Website Development">Website Development</SelectItem>
                          <SelectItem value="Full Digital Dominance">Full Digital Dominance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">How can we help?</label>
                      <Textarea name="message" placeholder="Tell us about your current challenges..." className="min-h-[140px] rounded-2xl bg-slate-50 border-slate-200 focus:bg-white resize-none transition-colors" required />
                    </div>

                    <Button type="submit" size="lg" className="w-full py-8 text-lg rounded-2xl font-black shadow-xl shadow-primary/20 hover:scale-[1.01] transition-all" disabled={loading}>
                      {loading ? <Loader2 className="w-6 h-6 animate-spin mr-2" /> : <Send className="w-6 h-6 mr-2" />}
                      Send My Inquiry
                    </Button>
                    <p className="text-center text-xs text-muted-foreground font-medium italic">
                      By submitting, you agree to be contacted via email/phone regarding your inquiry.
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}