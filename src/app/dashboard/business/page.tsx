
"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Loader2, 
  Globe, 
  MapPin, 
  Phone, 
  Briefcase, 
  Save, 
  ExternalLink,
  Sparkles,
  CheckCircle2
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { doc, setDoc, serverTimestamp, collection, addDoc, query, where, limit, onSnapshot } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { GbpContentGenerator } from "@/components/tools/GbpContentGenerator";
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export default function BusinessProfilePage() {
  const { user, isUserLoading: loading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [saveLoading, setSaveLoading] = useState(false);
  const [businessId, setBusinessId] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  // Find or determine the business ID for this user
  useEffect(() => {
    if (!user || !firestore) return;
    
    // Attempt to find existing business
    const q = query(collection(firestore, "businesses"), where("ownerUid", "==", user.uid), limit(1));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        setBusinessId(snapshot.docs[0].id);
      } else {
        // Fallback to user UID as the business ID for a new profile
        setBusinessId(user.uid);
      }
    });
    return unsubscribe;
  }, [user, firestore]);

  const businessRef = useMemoFirebase(() => (firestore && businessId) ? doc(firestore, "businesses", businessId) : null, [firestore, businessId]);
  const { data: business, isLoading: businessLoading } = useDoc<any>(businessRef);

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user || !firestore || !businessId) return;

    setSaveLoading(true);
    const formData = new FormData(e.currentTarget);
    
    const data = {
      name: formData.get("name"),
      category: formData.get("category"),
      address: formData.get("address"),
      phone: formData.get("phone"),
      description: formData.get("description"),
      website: formData.get("website"),
      updatedAt: serverTimestamp(),
      ownerUid: user.uid,
    };

    const docRef = doc(firestore, "businesses", businessId);

    setDoc(docRef, data, { merge: true })
      .then(() => {
        addDoc(collection(firestore, "businesses", businessId, "activities"), {
          type: "Profile Updated",
          content: "Core business information was updated.",
          ownerUid: user.uid,
          timestamp: serverTimestamp()
        });
        toast({ title: "Profile Saved", description: "Business details updated successfully." });
      })
      .catch(async (error) => {
        const permissionError = new FirestorePermissionError({
          path: docRef.path,
          operation: 'write',
          requestResourceData: data,
        });
        errorEmitter.emit('permission-error', permissionError);
      })
      .finally(() => setSaveLoading(false));
  };

  if (loading || !user || businessLoading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <div className="min-h-screen flex flex-col bg-accent/5">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-primary font-headline flex items-center gap-3">
              <Globe className="w-8 h-8 text-accent" /> Business Profile
            </h1>
            <p className="text-muted-foreground">Manage your identity across Google and local search.</p>
          </div>
          <Button variant="outline" className="rounded-xl" onClick={() => window.open("https://business.google.com", "_blank")}>
            View on Google <ExternalLink className="ml-2 w-4 h-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Edit Form */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="rounded-3xl border-none shadow-sm">
              <CardHeader>
                <CardTitle>Core Business Info</CardTitle>
                <CardDescription>This data is used to optimize your Google Business Profile.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Business Name</label>
                      <Input name="name" defaultValue={business?.name} required placeholder="Your Business Name" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Category</label>
                      <Input name="category" defaultValue={business?.category} placeholder="e.g. Italian Restaurant" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Physical Address</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input name="address" className="pl-10" defaultValue={business?.address} placeholder="123 Main St, City, Country" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Business Phone</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input name="phone" className="pl-10" defaultValue={business?.phone} placeholder="+1 234 567 890" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Website URL</label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input name="website" className="pl-10" defaultValue={business?.website} placeholder="https://example.com" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Business Description</label>
                    <Textarea name="description" className="min-h-[120px]" defaultValue={business?.description} placeholder="Describe your services and value..." />
                  </div>

                  <Button type="submit" className="w-full py-7 text-lg rounded-2xl shadow-lg" disabled={saveLoading}>
                    {saveLoading ? <Loader2 className="animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}
                    Save Changes
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* AI Assistant for Content */}
            <div className="space-y-6">
               <div className="flex items-center gap-2 px-2">
                  <Sparkles className="w-5 h-5 text-accent" />
                  <h3 className="text-xl font-bold text-primary">AI Content Assistant</h3>
               </div>
               <GbpContentGenerator />
            </div>
          </div>

          {/* Presence Status */}
          <div className="space-y-8">
            <Card className="rounded-3xl border-none shadow-sm bg-primary text-primary-foreground">
               <CardHeader>
                  <CardTitle className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5" /> Presence Status</CardTitle>
               </CardHeader>
               <CardContent className="space-y-4">
                  <div className="p-4 bg-white/10 rounded-2xl space-y-2">
                     <p className="text-sm font-bold opacity-80 uppercase tracking-widest">Google Maps</p>
                     <p className="text-xl font-bold">{business?.name ? 'Verified & Active' : 'Setup Required'}</p>
                  </div>
                  <div className="p-4 bg-white/10 rounded-2xl space-y-2">
                     <p className="text-sm font-bold opacity-80 uppercase tracking-widest">Visibility Score</p>
                     <p className="text-xl font-bold">{business?.name ? '84%' : '0%'}</p>
                  </div>
                  <div className="p-4 bg-white/10 rounded-2xl space-y-2">
                     <p className="text-sm font-bold opacity-80 uppercase tracking-widest">Profile Completeness</p>
                     <div className="w-full bg-white/20 h-2 rounded-full mt-2">
                        <div className={`bg-accent h-full rounded-full transition-all duration-500 ${business?.name ? 'w-[92%]' : 'w-[10%]'}`} />
                     </div>
                  </div>
               </CardContent>
            </Card>

            <Card className="rounded-3xl border-none shadow-sm overflow-hidden">
               <img src="https://picsum.photos/seed/map-preview/400/300" alt="Map Preview" className="w-full h-auto opacity-80" />
               <CardContent className="p-6">
                  <h4 className="font-bold mb-2">Google Maps Snapshot</h4>
                  <p className="text-sm text-muted-foreground">Your business is ranking in the top 3 for "Nearby {business?.category || 'Services'}".</p>
               </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
