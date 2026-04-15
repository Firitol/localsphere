
"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useUser, useFirestore } from "@/firebase";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { collection, addDoc, serverTimestamp, doc, updateDoc } from "firebase/firestore";
import { CheckCircle2, ShieldCheck, Landmark, Smartphone, CreditCard, Loader2, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

const PLANS: any = {
  foundation: { name: "Foundation", price: 15000, description: "One-time setup for new businesses" },
  growth: { name: "Growth Monthly", price: 4500, description: "Monthly optimization and management" }
};

export default function CheckoutPage() {
  const { user, isUserLoading } = useUser();
  const { planId } = useParams();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const plan = PLANS[planId as string];

  useEffect(() => {
    if (!isUserLoading && !user) router.push("/login");
  }, [user, isUserLoading, router]);

  if (!plan) return <div className="h-screen flex items-center justify-center">Plan not found</div>;

  const handleChapaPay = async () => {
    if (!user || !firestore) return;
    setLoading(true);

    const paymentData = {
      userId: user.uid,
      planId,
      amount: plan.price,
      currency: "ETB",
      method: "chapa",
      status: "pending",
      transactionRef: `LS-${Date.now()}-${user.uid.slice(0, 4)}`,
      createdAt: serverTimestamp(),
    };

    addDoc(collection(firestore, "payments"), paymentData)
      .then(() => {
        toast({ title: "Initializing Payment", description: "Redirecting you to Chapa secure checkout..." });
        // Mock redirect to Chapa
        setTimeout(() => {
          router.push(`/checkout/verify?ref=${paymentData.transactionRef}`);
        }, 1500);
      })
      .catch((error) => {
        setLoading(false);
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: 'payments',
          operation: 'create',
          requestResourceData: paymentData,
        }));
      });
  };

  const handleManualSubmission = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user || !firestore) return;
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const method = formData.get("method") as string;
    const ref = formData.get("reference") as string;

    const paymentData = {
      userId: user.uid,
      planId,
      amount: plan.price,
      currency: "ETB",
      method,
      status: "pending",
      transactionRef: ref,
      createdAt: serverTimestamp(),
      isManual: true,
    };

    addDoc(collection(firestore, "payments"), paymentData)
      .then(() => {
        updateDoc(doc(firestore, "users", user.uid), {
           subscriptionStatus: "pending",
           currentPlan: plan.name
        });
        toast({ title: "Receipt Uploaded", description: "Our team will verify your payment within 2-4 hours." });
        router.push("/dashboard");
      })
      .catch((error) => {
        setLoading(false);
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: 'payments',
          operation: 'create',
          requestResourceData: paymentData,
        }));
      });
  };

  return (
    <div className="min-h-screen flex flex-col bg-accent/5">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-6">
            <h1 className="text-3xl font-bold font-headline text-primary">Secure Checkout</h1>
            
            <Tabs defaultValue="automated" className="w-full">
              <TabsList className="grid w-full grid-cols-2 h-auto p-1 bg-muted rounded-2xl">
                <TabsTrigger value="automated" className="py-3 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white">
                  <Smartphone className="w-4 h-4 mr-2" /> Chapa / Telebirr
                </TabsTrigger>
                <TabsTrigger value="manual" className="py-3 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white">
                  <Landmark className="w-4 h-4 mr-2" /> Bank Transfer
                </TabsTrigger>
              </TabsList>

              <TabsContent value="automated" className="mt-6 space-y-4">
                <Card className="rounded-3xl border-none shadow-sm">
                  <CardContent className="p-8 space-y-6">
                    <div className="flex items-center justify-between p-4 bg-accent/5 rounded-2xl border border-accent/20">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                            <CreditCard className="text-primary" />
                         </div>
                         <div>
                            <p className="font-bold">Instant Activation</p>
                            <p className="text-xs text-muted-foreground">Pay with Telebirr, CBE Birr, or Card</p>
                         </div>
                      </div>
                      <Badge className="bg-green-500">Fastest</Badge>
                    </div>

                    <Button 
                      className="w-full py-8 text-lg rounded-2xl bg-primary hover:bg-primary/90 shadow-xl"
                      onClick={handleChapaPay}
                      disabled={loading}
                    >
                      {loading ? <Loader2 className="animate-spin mr-2" /> : <ShieldCheck className="mr-2" />}
                      Pay {plan.price.toLocaleString()} ETB Now
                    </Button>
                    <p className="text-center text-xs text-muted-foreground">Secure payment processed by Chapa Financial Technologies.</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="manual" className="mt-6">
                <Card className="rounded-3xl border-none shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Bank Transfer Instructions</CardTitle>
                    <CardDescription>Transfer the exact amount to one of our accounts below.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div className="p-4 bg-muted/30 rounded-2xl border space-y-1">
                          <p className="text-[10px] font-bold text-muted-foreground uppercase">Commercial Bank (CBE)</p>
                          <p className="font-bold text-primary">1000123456789</p>
                          <p className="text-xs">LocalSphere Tech PLC</p>
                       </div>
                       <div className="p-4 bg-muted/30 rounded-2xl border space-y-1">
                          <p className="text-[10px] font-bold text-muted-foreground uppercase">Dashen Bank</p>
                          <p className="font-bold text-primary">5432167890</p>
                          <p className="text-xs">LocalSphere Tech PLC</p>
                       </div>
                    </div>

                    <form onSubmit={handleManualSubmission} className="space-y-4 pt-4 border-t">
                       <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                             <label className="text-sm font-medium">Payment Bank</label>
                             <select name="method" className="w-full h-10 px-3 rounded-md border bg-background text-sm" required>
                                <option value="cbe">CBE</option>
                                <option value="dashen">Dashen</option>
                                <option value="telebirr">Telebirr (Manual)</option>
                             </select>
                          </div>
                          <div className="space-y-2">
                             <label className="text-sm font-medium">Transaction Reference</label>
                             <Input name="reference" placeholder="FT24..." required />
                          </div>
                       </div>
                       <div className="space-y-2">
                          <label className="text-sm font-medium">Upload Receipt (Optional)</label>
                          <div className="border-2 border-dashed rounded-2xl p-8 text-center space-y-2 cursor-pointer hover:bg-muted/30 transition-colors">
                             <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
                             <p className="text-sm text-muted-foreground">Drag and drop or click to upload screenshot</p>
                          </div>
                       </div>
                       <Button type="submit" variant="secondary" className="w-full py-7 rounded-2xl font-bold" disabled={loading}>
                          {loading ? <Loader2 className="animate-spin mr-2" /> : <CheckCircle2 className="mr-2" />}
                          Confirm Submission
                       </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <Card className="rounded-3xl border-none shadow-sm bg-primary text-primary-foreground">
               <CardHeader>
                  <CardTitle className="text-xl">Order Summary</CardTitle>
               </CardHeader>
               <CardContent className="space-y-4">
                  <div className="flex justify-between items-center border-b border-white/10 pb-4">
                     <div>
                        <p className="font-bold">{plan.name}</p>
                        <p className="text-xs opacity-70">{plan.description}</p>
                     </div>
                     <p className="font-bold">{plan.price.toLocaleString()} ETB</p>
                  </div>
                  <div className="space-y-2 pt-2">
                     <div className="flex justify-between text-sm">
                        <span className="opacity-70">Subtotal</span>
                        <span>{plan.price.toLocaleString()} ETB</span>
                     </div>
                     <div className="flex justify-between text-sm">
                        <span className="opacity-70">Tax (VAT 15%)</span>
                        <span>0 ETB</span>
                     </div>
                     <div className="flex justify-between text-xl font-bold pt-2 border-t border-white/10">
                        <span>Total</span>
                        <span>{plan.price.toLocaleString()} ETB</span>
                     </div>
                  </div>
               </CardContent>
            </Card>

            <div className="p-6 bg-white rounded-3xl space-y-4">
               <h4 className="font-bold flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-accent" /> Why LocalSphere?</h4>
               <ul className="space-y-3 text-sm text-muted-foreground">
                  <li>• Optimized for Ethiopia local search</li>
                  <li>• Amharic & English AI assistance</li>
                  <li>• 24/7 Local phone support</li>
                  <li>• Cancel monthly plans anytime</li>
               </ul>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
