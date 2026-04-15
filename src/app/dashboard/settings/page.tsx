
"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useUser, useFirestore, useDoc } from "@/firebase";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { 
  Loader2, 
  Settings, 
  Bell, 
  Lock, 
  User, 
  CreditCard,
  ChevronRight,
  ShieldCheck
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const { user, loading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  const handleUpdateAccount = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user || !firestore) return;
    setSaving(true);
    
    const formData = new FormData(e.currentTarget);
    try {
      const userRef = doc(firestore, "users", user.uid);
      await updateDoc(userRef, {
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
      });
      toast({ title: "Settings Saved", description: "Your profile has been updated." });
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: "Failed to update profile." });
    } finally {
      setSaving(false);
    }
  };

  if (loading || !user) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="min-h-screen flex flex-col bg-accent/5">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-primary font-headline flex items-center gap-3">
              <Settings className="w-8 h-8 text-accent" /> Account Settings
            </h1>
            <p className="text-muted-foreground">Manage your personal preferences and billing.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <aside className="space-y-2">
              {[
                { label: "Profile", icon: User, active: true },
                { label: "Notifications", icon: Bell, active: false },
                { label: "Security", icon: Lock, active: false },
                { label: "Billing", icon: CreditCard, active: false },
              ].map((item, idx) => (
                <Button 
                  key={idx} 
                  variant={item.active ? "default" : "ghost"} 
                  className={`w-full justify-start rounded-xl ${item.active ? 'bg-primary' : 'text-muted-foreground'}`}
                >
                  <item.icon className="w-4 h-4 mr-3" />
                  {item.label}
                </Button>
              ))}
            </aside>

            <div className="md:col-span-2 space-y-8">
              {/* Profile Section */}
              <Card className="rounded-3xl border-none shadow-sm">
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your name and email address.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUpdateAccount} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">First Name</label>
                        <Input name="firstName" defaultValue={user.displayName?.split(' ')[0]} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Last Name</label>
                        <Input name="lastName" defaultValue={user.displayName?.split(' ')[1]} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email Address</label>
                      <Input value={user.email || ""} disabled className="bg-muted/50" />
                      <p className="text-[10px] text-muted-foreground">Email changes require re-authentication.</p>
                    </div>
                    <Button type="submit" className="rounded-xl px-8" disabled={saving}>
                      {saving && <Loader2 className="animate-spin mr-2" />} Save Profile
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Preferences Section */}
              <Card className="rounded-3xl border-none shadow-sm">
                <CardHeader>
                  <CardTitle>Preferences</CardTitle>
                  <CardDescription>Control your dashboard experience.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {[
                    { title: "Weekly Growth Report", desc: "Receive a summary of your local search ranking.", icon: TrendingUp },
                    { title: "New Lead Alerts", desc: "Get notified immediately when a new lead is added.", icon: Bell },
                    { title: "AI Content Suggestions", desc: "Let Gemini suggest new posts for your profile.", icon: ShieldCheck },
                  ].map((pref, i) => (
                    <div key={i} className="flex items-center justify-between group">
                      <div className="flex gap-4">
                        <div className="p-2 rounded-xl bg-accent/10 text-accent">
                          <pref.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-sm text-primary">{pref.title}</p>
                          <p className="text-xs text-muted-foreground">{pref.desc}</p>
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Billing Quick Look */}
              <Card className="rounded-3xl border-none shadow-sm bg-primary text-primary-foreground overflow-hidden">
                <CardContent className="p-8 flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-xs font-bold uppercase tracking-widest opacity-80">Current Plan</p>
                    <h3 className="text-2xl font-bold">Growth Monthly</h3>
                    <p className="text-sm opacity-90">Next billing on April 12, 2024</p>
                  </div>
                  <Button variant="secondary" className="rounded-xl">
                    Manage Billing <ChevronRight className="ml-2 w-4 h-4" />
                  </Button>
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
