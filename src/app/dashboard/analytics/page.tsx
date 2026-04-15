
"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area
} from "recharts";
import { 
  Loader2, 
  TrendingUp, 
  Users, 
  MousePointer2, 
  PhoneCall,
  BarChart3,
  Calendar
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { collection, query, limit, orderBy } from "firebase/firestore";

const mockPerformanceData = [
  { name: 'Mon', views: 400, clicks: 240, calls: 12 },
  { name: 'Tue', views: 300, clicks: 139, calls: 8 },
  { name: 'Wed', views: 200, clicks: 980, calls: 25 },
  { name: 'Thu', views: 278, clicks: 390, calls: 15 },
  { name: 'Fri', views: 189, clicks: 480, calls: 20 },
  { name: 'Sat', views: 239, clicks: 380, calls: 30 },
  { name: 'Sun', views: 349, clicks: 430, calls: 22 },
];

export default function AnalyticsPage() {
  const { user, loading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  const businessId = "main-business";
  
  const metricsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, "clients", "default-client", "businessProfiles", businessId, "seoMetrics"),
      orderBy("dateRecorded", "desc"),
      limit(30)
    );
  }, [firestore]);

  const { data: metrics, isLoading: metricsLoading } = useCollection(metricsQuery);

  if (loading || !user) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="min-h-screen flex flex-col bg-accent/5">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-primary font-headline flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-accent" /> Performance Insights
            </h1>
            <p className="text-muted-foreground">Detailed breakdown of your business growth and visibility.</p>
          </div>
          <div className="flex items-center gap-2 bg-white p-2 rounded-xl shadow-sm border">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Last 7 Days</span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: "Profile Views", value: "1,284", icon: TrendingUp, color: "text-blue-500", bg: "bg-blue-50" },
            { label: "Website Clicks", value: "432", icon: MousePointer2, color: "text-purple-500", bg: "bg-purple-50" },
            { label: "Direct Calls", value: "84", icon: PhoneCall, color: "text-green-500", bg: "bg-green-50" },
            { label: "New Leads", value: "+12", icon: Users, color: "text-orange-500", bg: "bg-orange-50" },
          ].map((stat, idx) => (
            <Card key={idx} className="border-none shadow-sm rounded-3xl overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-lg">+14%</span>
                </div>
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <h3 className="text-2xl font-bold text-primary">{stat.value}</h3>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Main Visibility Chart */}
          <Card className="rounded-3xl border-none shadow-sm">
            <CardHeader>
              <CardTitle>Visibility Trends</CardTitle>
              <CardDescription>Daily views across Google Search and Maps.</CardDescription>
            </CardHeader>
            <CardContent className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockPerformanceData}>
                  <defs>
                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="views" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorViews)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Customer Action Chart */}
          <Card className="rounded-3xl border-none shadow-sm">
            <CardHeader>
              <CardTitle>Customer Actions</CardTitle>
              <CardDescription>Breakdown of how users interact with your profile.</CardDescription>
            </CardHeader>
            <CardContent className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} />
                  <Tooltip 
                    cursor={{fill: 'transparent'}}
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="clicks" fill="hsl(var(--accent))" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="calls" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
