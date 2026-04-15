
"use client";

import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Loader2, 
  LayoutDashboard, 
  Users, 
  Settings, 
  Globe, 
  TrendingUp, 
  PlusCircle, 
  ChevronRight,
  BarChart3,
  Crown
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { collection, query, limit, orderBy, onSnapshot, where } from "firebase/firestore";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export default function DashboardPage() {
  const { user, isUserLoading: loading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const [businessData, setBusinessData] = useState<any>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user || !firestore) return;
    
    // Filter by ownerUid to comply with security rules
    const q = query(
      collection(firestore, "businesses"), 
      where("ownerUid", "==", user.uid),
      limit(1)
    );

    const unsubscribe = onSnapshot(
      q, 
      (snapshot) => {
        if (!snapshot.empty) {
          setBusinessData({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() });
        }
      },
      async (error) => {
        const contextualError = new FirestorePermissionError({
          path: 'businesses',
          operation: 'list',
        });
        errorEmitter.emit('permission-error', contextualError);
      }
    );
    return () => unsubscribe();
  }, [user, firestore]);

  const customersQuery = useMemoFirebase(() => {
    if (!firestore || !businessData || !user) return null;
    return query(
      collection(firestore, "businesses", businessData.id, "customers"), 
      where("ownerUid", "==", user.uid),
      orderBy("createdAt", "desc"),
      limit(5)
    );
  }, [firestore, businessData, user]);

  const activitiesQuery = useMemoFirebase(() => {
    if (!firestore || !businessData || !user) return null;
    return query(
      collection(firestore, "businesses", businessData.id, "activities"), 
      where("ownerUid", "==", user.uid),
      orderBy("timestamp", "desc"),
      limit(5)
    );
  }, [firestore, businessData, user]);

  const { data: customers, isLoading: customersLoading } = useCollection(customersQuery);
  const { data: activities, isLoading: activitiesLoading } = useCollection(activitiesQuery);

  if (loading || !user) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-accent/5">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-72 space-y-4">
            <div className="p-6 bg-white rounded-3xl shadow-sm border space-y-2">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-2">Management</p>
              {[
                { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard", active: true },
                { label: "Business Profile", icon: Globe, href: "/dashboard/business", active: false },
                { label: "Customers (CRM)", icon: Users, href: "/dashboard/customers", active: false },
                { label: "Performance", icon: BarChart3, href: "/dashboard/analytics", active: false },
              ].map((item, idx) => (
                <Link key={idx} href={item.href}>
                  <Button
                    variant={item.active ? "default" : "ghost"}
                    className={`w-full justify-start rounded-xl mb-1 ${item.active ? "bg-primary" : "text-muted-foreground"}`}
                  >
                    <item.icon className="w-4 h-4 mr-3" />
                    {item.label}
                  </Button>
                </Link>
              ))}
              <div className="pt-4 border-t mt-4">
                <Link href="/dashboard/settings">
                  <Button variant="ghost" className="w-full justify-start rounded-xl text-muted-foreground">
                    <Settings className="w-4 h-4 mr-3" /> Settings
                  </Button>
                </Link>
              </div>
            </div>

            <div className="p-6 bg-primary text-primary-foreground rounded-3xl shadow-lg space-y-4">
               <div className="flex items-center justify-between">
                  <h4 className="font-bold flex items-center gap-2"><Crown className="w-4 h-4 text-accent" /> Premium Plan</h4>
                  <Badge variant="secondary" className="bg-accent text-primary font-bold">Pro</Badge>
               </div>
               <p className="text-xs opacity-80">You have access to all advanced CRM and AI features.</p>
               <Button variant="secondary" className="w-full justify-start text-xs" size="sm" onClick={() => router.push('/dashboard/customers')}>
                  <PlusCircle className="w-3 h-3 mr-2" /> Add New Customer
               </Button>
            </div>
          </aside>

          <div className="flex-1 space-y-8">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="space-y-1">
                <h1 className="text-3xl font-bold font-headline text-primary">
                  {businessData?.name ? `${businessData.name} Overview` : "Operations Dashboard"}
                </h1>
                <p className="text-muted-foreground">Manage your business operations and visibility.</p>
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl shadow-sm border">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-bold text-primary">Live Operations</span>
              </div>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { label: "Total Customers", value: customers?.length || "0", sub: "Active leads", icon: Users },
                { label: "Google Visibility", value: "Optimal", sub: "Verified status", icon: Globe },
                { label: "Efficiency Score", value: "94%", sub: "High Performance", icon: TrendingUp },
              ].map((stat, idx) => (
                <Card key={idx} className="rounded-3xl border-none shadow-sm overflow-hidden group hover:scale-[1.02] transition-transform">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
                    <stat.icon className="w-4 h-4 text-accent" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-primary">{stat.value}</div>
                    <p className="text-xs text-green-600 font-bold mt-1">{stat.sub}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <Card className="rounded-3xl border-none shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">Recent Customers</CardTitle>
                    <CardDescription>Latest CRM entries.</CardDescription>
                  </div>
                  <Link href="/dashboard/customers">
                    <Button variant="outline" size="sm" className="rounded-xl">View All</Button>
                  </Link>
                </CardHeader>
                <CardContent className="space-y-4">
                  {customersLoading ? (
                    <div className="py-12 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-muted" /></div>
                  ) : customers && customers.length > 0 ? (
                    customers.map((c: any, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-accent/5 rounded-2xl group hover:bg-accent/10 transition-colors cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                            {c.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-primary">{c.name}</p>
                            <p className="text-xs text-muted-foreground">{c.phone || c.email}</p>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-muted-foreground italic">No customers yet. Start growing your list.</div>
                  )}
                </CardContent>
              </Card>

              <Card className="rounded-3xl border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl">Operational Feed</CardTitle>
                  <CardDescription>System logs and updates.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {activitiesLoading ? (
                    <div className="py-12 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-muted" /></div>
                  ) : activities && activities.length > 0 ? (
                    activities.map((act: any, i) => (
                      <div key={i} className="flex gap-4 relative">
                        <div className="mt-1 w-2 h-2 rounded-full bg-accent shrink-0" />
                        <div className="space-y-1 pb-4 border-b border-border/50 w-full last:border-0">
                          <div className="flex justify-between">
                            <p className="text-sm font-bold text-primary">{act.type}</p>
                            <p className="text-[10px] text-muted-foreground/60">
                              {act.timestamp?.toDate ? new Date(act.timestamp.toDate()).toLocaleTimeString() : 'Just now'}
                            </p>
                          </div>
                          <p className="text-xs text-muted-foreground">{act.content}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-muted-foreground italic">Your operational feed is ready for activity.</div>
                  )}
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
