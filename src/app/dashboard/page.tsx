
"use client";

import { useUser, useFirestore, useCollection } from "@/firebase";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Loader2, 
  LayoutDashboard, 
  Users, 
  Settings, 
  Globe, 
  TrendingUp, 
  PlusCircle, 
  ChevronRight,
  Activity,
  BarChart3
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { collection, query, limit, orderBy, onSnapshot, doc, setDoc, serverTimestamp } from "firebase/firestore";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";

export default function DashboardPage() {
  const { user, loading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const [businessData, setBusinessData] = useState<any>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // Fetch business profile associated with user
  useEffect(() => {
    if (!user || !firestore) return;
    const q = query(collection(firestore, "businesses"), limit(1)); // Mocking single business for MVP
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        setBusinessData({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() });
      }
    });
    return unsubscribe;
  }, [user, firestore]);

  const customersQuery = useMemo(() => {
    if (!firestore || !businessData) return null;
    return query(collection(firestore, "businesses", businessData.id, "customers"), limit(5), orderBy("createdAt", "desc"));
  }, [firestore, businessData]);

  const activitiesQuery = useMemo(() => {
    if (!firestore || !businessData) return null;
    return query(collection(firestore, "businesses", businessData.id, "activities"), limit(5), orderBy("timestamp", "desc"));
  }, [firestore, businessData]);

  const { data: customers, loading: customersLoading } = useCollection(customersQuery);
  const { data: activities, loading: activitiesLoading } = useCollection(activitiesQuery);

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
          {/* Sidebar Navigation */}
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

            {/* Quick Actions */}
            <div className="p-6 bg-primary text-primary-foreground rounded-3xl shadow-lg space-y-4">
               <h4 className="font-bold flex items-center gap-2"><PlusCircle className="w-4 h-4" /> Quick Actions</h4>
               <Button variant="secondary" className="w-full justify-start" size="sm" onClick={() => router.push('/dashboard/customers')}>
                  Add New Customer
               </Button>
               <Button variant="secondary" className="w-full justify-start" size="sm" onClick={() => router.push('/dashboard/business')}>
                  Post Status Update
               </Button>
            </div>
          </aside>

          {/* Main Workspace */}
          <div className="flex-1 space-y-8">
            <header className="space-y-2">
              <h1 className="text-3xl font-bold font-headline text-primary">
                {businessData?.name ? `${businessData.name} Overview` : "Operations Dashboard"}
              </h1>
              <p className="text-muted-foreground">Manage your business operations and visibility from one place.</p>
            </header>

            {/* Key Performance Indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { label: "Total Customers", value: customers?.length || "0", sub: "+2 this week", icon: Users },
                { label: "Google Visibility", value: "High", sub: "Verified status", icon: Globe },
                { label: "Activity Score", value: "88%", sub: "Improving", icon: TrendingUp },
              ].map((stat, idx) => (
                <Card key={idx} className="rounded-3xl border-none shadow-sm overflow-hidden">
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
              {/* Recent Customers CRM Preview */}
              <Card className="rounded-3xl border-none shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">Recent Customers</CardTitle>
                    <CardDescription>Latest additions to your database.</CardDescription>
                  </div>
                  <Link href="/dashboard/customers">
                    <Button variant="outline" size="sm">View All</Button>
                  </Link>
                </CardHeader>
                <CardContent className="space-y-4">
                  {customersLoading ? (
                    <div className="py-12 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-muted" /></div>
                  ) : customers && customers.length > 0 ? (
                    customers.map((c: any, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-accent/5 rounded-2xl group hover:bg-accent/10 transition-colors">
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
                    <div className="text-center py-12 text-muted-foreground italic">No customers yet. Add your first lead.</div>
                  )}
                </CardContent>
              </Card>

              {/* Operations Activity Log */}
              <Card className="rounded-3xl border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl">Activity Feed</CardTitle>
                  <CardDescription>Recent actions and system updates.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {activitiesLoading ? (
                    <div className="py-12 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-muted" /></div>
                  ) : activities && activities.length > 0 ? (
                    activities.map((act: any, i) => (
                      <div key={i} className="flex gap-4 relative">
                        <div className="mt-1 w-2 h-2 rounded-full bg-accent shrink-0" />
                        <div className="space-y-1 pb-4 border-b border-border/50 w-full last:border-0">
                          <p className="text-sm font-bold text-primary">{act.type}</p>
                          <p className="text-xs text-muted-foreground">{act.content}</p>
                          <p className="text-[10px] text-muted-foreground/60">{new Date(act.timestamp?.toDate()).toLocaleTimeString()}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-muted-foreground italic">No recent activity found.</div>
                  )}
                  {/* Mock Activity if empty */}
                  {(!activities || activities.length === 0) && (
                     <div className="space-y-4 opacity-50">
                        <div className="flex gap-4">
                           <Activity className="w-4 h-4" />
                           <p className="text-sm">Welcome to LocalSphere Manager!</p>
                        </div>
                     </div>
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
