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
  ChevronRight,
  Star,
  History,
  MapPin,
  Phone,
  ExternalLink,
  CheckCircle2,
  Zap,
  Plus
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { collection, query, limit, orderBy, onSnapshot, where } from "firebase/firestore";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function DashboardPage() {
  const { user, isUserLoading: loading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const [businessData, setBusinessData] = useState<any>(null);
  const [isSearchingBusiness, setIsSearchingBusiness] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user || !firestore) return;
    
    // Find the business owned by this user
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
        setIsSearchingBusiness(false);
      },
      () => {
        setIsSearchingBusiness(false);
      }
    );
    return () => unsubscribe();
  }, [user, firestore]);

  // Use the identified business ID, otherwise null (don't fallback to user.uid to avoid permission errors on non-existent paths)
  const businessId = businessData?.id;

  const customersQuery = useMemoFirebase(() => {
    if (!firestore || !businessId || !user) return null;
    return query(
      collection(firestore, "businesses", businessId, "customers"), 
      orderBy("createdAt", "desc"),
      limit(5)
    );
  }, [firestore, businessId, user]);

  const activitiesQuery = useMemoFirebase(() => {
    if (!firestore || !businessId || !user) return null;
    return query(
      collection(firestore, "businesses", businessId, "activities"), 
      orderBy("timestamp", "desc"),
      limit(5)
    );
  }, [firestore, businessId, user]);

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
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Navigation */}
          <aside className="w-full lg:w-64 shrink-0 space-y-4">
            <div className="p-4 bg-white rounded-[24px] shadow-sm border border-slate-100 space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] px-3 mb-3">Management</p>
              {[
                { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard", active: true },
                { label: "Business Profile", icon: Globe, href: "/dashboard/business", active: false },
                { label: "Customers", icon: Users, href: "/dashboard/customers", active: false },
                { label: "Activity", icon: History, href: "/dashboard", active: false },
                { label: "Reviews", icon: Star, href: "/dashboard", active: false },
              ].map((item, idx) => (
                <Link key={idx} href={item.href}>
                  <Button
                    variant={item.active ? "default" : "ghost"}
                    className={`w-full justify-start h-11 rounded-[14px] ${item.active ? "bg-primary shadow-md shadow-primary/20" : "text-slate-500 hover:bg-slate-50"}`}
                  >
                    <item.icon className={`w-4 h-4 mr-3 ${item.active ? "text-white" : "text-slate-400"}`} />
                    <span className="font-medium">{item.label}</span>
                  </Button>
                </Link>
              ))}
              <div className="pt-4 mt-4 border-t border-slate-50">
                <Link href="/dashboard/settings">
                  <Button variant="ghost" className="w-full justify-start h-11 rounded-[14px] text-slate-500 hover:bg-slate-50">
                    <Settings className="w-4 h-4 mr-3 text-slate-400" />
                    <span className="font-medium">Settings</span>
                  </Button>
                </Link>
              </div>
            </div>

            {/* Premium Status Card */}
            <div className="p-6 bg-slate-900 rounded-[24px] shadow-xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                 <Zap className="w-16 h-16 text-white" />
               </div>
               <div className="relative z-10 space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Zap className="w-4 h-4 text-primary fill-primary" />
                    </div>
                    <span className="text-white font-bold text-sm">Demo Status</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">Your business is currently in demo mode. Unlock all features today.</p>
                  <Button variant="default" className="w-full bg-primary hover:bg-primary/90 text-xs h-9 rounded-xl shadow-lg shadow-primary/20" onClick={() => router.push('/pricing')}>
                    Activate Premium
                  </Button>
               </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1 space-y-8">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="space-y-1">
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  {businessData?.name || "Business Overview"}
                </h1>
                <p className="text-slate-500 font-medium">Welcome back, {user.displayName?.split(' ')[0] || 'Partner'}.</p>
              </div>
              <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-[18px] shadow-sm border border-slate-100">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-slate-700">Live Status: Active</span>
              </div>
            </header>

            {/* Top KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Visibility", status: "Visible Online", icon: Globe, color: "bg-blue-50 text-blue-600", border: "border-blue-100" },
                { label: "Customers", status: `${customers?.length || 0} Registered`, icon: Users, color: "bg-emerald-50 text-emerald-600", border: "border-emerald-100" },
                { label: "Reviews", status: "Ready to Collect", icon: Star, color: "bg-amber-50 text-amber-600", border: "border-amber-100" },
                { label: "Growth", status: "Starting Phase", icon: TrendingUp, color: "bg-indigo-50 text-indigo-600", border: "border-indigo-100" },
              ].map((stat, idx) => (
                <Card key={idx} className={`rounded-[24px] border shadow-sm ${stat.border}`}>
                  <CardContent className="p-6">
                    <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-4`}>
                      <stat.icon className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{stat.label}</p>
                    <h3 className="text-sm font-bold text-slate-900">{stat.status}</h3>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              
              {/* Left Column: Profile & Customers */}
              <div className="xl:col-span-2 space-y-8">
                
                {/* Google Style Profile Preview */}
                <Card className="rounded-[24px] border-none shadow-sm overflow-hidden bg-white">
                  <CardHeader className="border-b border-slate-50 pb-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Globe className="w-5 h-5 text-primary" />
                        <CardTitle className="text-lg">Online Presence Preview</CardTitle>
                      </div>
                      <Badge variant="outline" className="rounded-full border-emerald-100 bg-emerald-50 text-emerald-700 font-bold px-3">Google Maps Optimized</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="grid grid-cols-1 md:grid-cols-2">
                      <div className="p-8 space-y-6">
                        <div className="space-y-2">
                          <h2 className="text-2xl font-black text-slate-900">{businessData?.name || "Local Business Name"}</h2>
                          <div className="flex items-center gap-1 text-amber-400">
                            {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                            <span className="text-slate-400 text-xs font-bold ml-1">5.0 (New)</span>
                          </div>
                          <p className="text-sm font-bold text-primary">{businessData?.category || "Category Not Set"}</p>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                            <p className="text-sm text-slate-600 leading-snug">{businessData?.address || "Address pending setup..."}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <Phone className="w-5 h-5 text-slate-400 shrink-0" />
                            <p className="text-sm text-slate-600 font-bold">{businessData?.phone || "Phone pending..."}</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 pt-2">
                          <Button size="sm" className="rounded-xl h-9 px-4 bg-primary"><Phone className="w-3.5 h-3.5 mr-2" /> Call</Button>
                          <Button size="sm" variant="outline" className="rounded-xl h-9 px-4"><MapPin className="w-3.5 h-3.5 mr-2" /> Directions</Button>
                          <Button size="sm" variant="ghost" className="rounded-xl h-9 px-4"><ExternalLink className="w-3.5 h-3.5 mr-2" /> View Site</Button>
                        </div>
                      </div>
                      <div className="relative bg-slate-100 min-h-[250px] overflow-hidden">
                        <img 
                          src="https://picsum.photos/seed/map-preview/800/600" 
                          alt="Map" 
                          className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/20 to-transparent" />
                        <div className="absolute bottom-4 left-4">
                           <Badge className="bg-white/90 backdrop-blur-sm text-slate-900 border-none shadow-lg">Live Preview</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Customer Table Preview */}
                <Card className="rounded-[24px] border-none shadow-sm bg-white overflow-hidden">
                  <CardHeader className="p-6 border-b border-slate-50 flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Customer Management</CardTitle>
                      <CardDescription>Your local customer relationships.</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" className="rounded-xl" onClick={() => router.push('/dashboard/customers')}>
                      <Plus className="w-4 h-4 mr-2" /> Add
                    </Button>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead className="bg-slate-50/50 border-b border-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          <tr>
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Phone</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {isSearchingBusiness || customersLoading ? (
                            <tr><td colSpan={4} className="py-12 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-slate-200" /></td></tr>
                          ) : customers && customers.length > 0 ? (
                            customers.map((c: any, i) => (
                              <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4 font-bold text-slate-900 text-sm">{c.name}</td>
                                <td className="px-6 py-4 text-slate-500 text-sm">{c.phone || "No phone"}</td>
                                <td className="px-6 py-4">
                                  <Badge className="bg-blue-50 text-blue-700 border-none text-[10px] font-bold py-0.5 px-2">NEW</Badge>
                                </td>
                                <td className="px-6 py-4 text-right">
                                  <ChevronRight className="w-4 h-4 text-slate-300 ml-auto" />
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr><td colSpan={4} className="py-12 text-center text-slate-400 text-sm italic">No customer data yet.</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column: Activity & CTA */}
              <div className="space-y-8">
                
                {/* High Conversion CTA Panel */}
                <Card className="rounded-[24px] border-none shadow-2xl bg-slate-900 text-white overflow-hidden relative">
                  <div className="absolute top-0 right-0 p-8 opacity-20 rotate-12">
                     <Zap className="w-24 h-24 text-primary fill-primary" />
                  </div>
                  <CardHeader className="relative z-10 pt-8 px-8">
                    <Badge className="bg-primary text-white border-none w-fit mb-4">Limited Offer</Badge>
                    <CardTitle className="text-2xl font-black leading-tight">Activate Your Business System</CardTitle>
                    <CardDescription className="text-slate-400 font-medium">Get fully verified and managed online.</CardDescription>
                  </CardHeader>
                  <CardContent className="relative z-10 p-8 pt-0 space-y-6">
                    <div className="space-y-3 pt-4">
                      <div className="flex justify-between items-center text-sm border-b border-white/10 pb-3">
                         <span className="text-slate-400">One-time Setup Fee</span>
                         <span className="font-black text-primary">800 ETB</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                         <span className="text-slate-400">Monthly Management</span>
                         <span className="font-black text-primary">500 ETB</span>
                      </div>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-4 space-y-2">
                       <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">What's Included</p>
                       <ul className="text-xs space-y-2 text-slate-300">
                         <li className="flex gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-primary" /> Google Business Verification</li>
                         <li className="flex gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-primary" /> Local SEO & Maps Presence</li>
                         <li className="flex gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-primary" /> Customer CRM Access</li>
                       </ul>
                    </div>
                    <Button className="w-full py-7 text-lg rounded-2xl bg-primary hover:bg-primary/90 font-black shadow-xl shadow-primary/20" onClick={() => router.push('/pricing')}>
                       Activate Now
                    </Button>
                  </CardContent>
                </Card>

                {/* Activity Feed */}
                <Card className="rounded-[24px] border-none shadow-sm bg-white">
                  <CardHeader className="p-6 border-b border-slate-50">
                    <CardTitle className="text-lg">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-8 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-50">
                      {isSearchingBusiness || activitiesLoading ? (
                        <div className="py-12 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-slate-200" /></div>
                      ) : activities && activities.length > 0 ? (
                        activities.map((act: any, i) => (
                          <div key={i} className="flex gap-4 relative">
                            <div className="w-6 h-6 rounded-full bg-white border-2 border-primary flex items-center justify-center relative z-10">
                               <div className="w-2 h-2 rounded-full bg-primary" />
                            </div>
                            <div className="flex-1 space-y-1">
                               <p className="text-xs font-bold text-slate-900">{act.type}</p>
                               <p className="text-[10px] text-slate-400">{act.content}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="space-y-8">
                          {[
                            { title: "System Initialized", desc: "LocalSphere instance ready." },
                            { title: "Dashboard Ready", desc: "Your workspace is active." }
                          ].map((act, i) => (
                            <div key={i} className="flex gap-4 relative">
                              <div className="w-6 h-6 rounded-full bg-white border-2 border-slate-100 flex items-center justify-center relative z-10">
                                 <div className="w-2 h-2 rounded-full bg-slate-200" />
                              </div>
                              <div className="flex-1 space-y-1">
                                 <p className="text-xs font-bold text-slate-900">{act.title}</p>
                                 <p className="text-[10px] text-slate-400">{act.desc}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}