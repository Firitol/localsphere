
"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useUser, useFirestore, useCollection } from "@/firebase";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, LayoutDashboard, Settings, User, Bell, ChevronRight, BarChart3, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { collection, query, where } from "firebase/firestore";

export default function DashboardPage() {
  const { user, loading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const inquiriesQuery = useMemo(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, "inquiries"), where("email", "==", user.email));
  }, [firestore, user]);

  const { data: inquiries, loading: inquiriesLoading } = useCollection(inquiriesQuery);

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
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-64 space-y-2">
            {[
              { label: "Overview", icon: LayoutDashboard, active: true },
              { label: "My Profile", icon: User, active: false },
              { label: "Notifications", icon: Bell, active: false },
              { label: "Settings", icon: Settings, active: false },
            ].map((item, idx) => (
              <Button
                key={idx}
                variant={item.active ? "default" : "ghost"}
                className={`w-full justify-start rounded-xl ${item.active ? "" : "text-muted-foreground"}`}
              >
                <item.icon className="w-4 h-4 mr-3" />
                {item.label}
              </Button>
            ))}
          </aside>

          {/* Main Content */}
          <div className="flex-1 space-y-8">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold font-headline text-primary">Welcome, {user.displayName || "Business Owner"}!</h1>
              <p className="text-muted-foreground">Manage your local growth tools and track your inquiries.</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="rounded-2xl shadow-sm border-none bg-primary text-primary-foreground">
                <CardHeader className="pb-2">
                  <CardDescription className="text-primary-foreground/70 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" /> SEO Health Score
                  </CardDescription>
                  <CardTitle className="text-4xl font-bold">84%</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs">Up 12% from last month</p>
                </CardContent>
              </Card>
              <Card className="rounded-2xl shadow-sm border-none bg-white">
                <CardHeader className="pb-2">
                  <CardDescription className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-accent" /> Active Inquiries
                  </CardDescription>
                  <CardTitle className="text-4xl font-bold text-primary">{inquiries?.length || 0}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">Latest inquiry from today</p>
                </CardContent>
              </Card>
              <Card className="rounded-2xl shadow-sm border-none bg-white">
                <CardHeader className="pb-2">
                  <CardDescription className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-primary" /> Visibility Index
                  </CardDescription>
                  <CardTitle className="text-4xl font-bold text-primary">High</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">Ranking for 15+ keywords</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity / Inquiries */}
            <Card className="rounded-2xl shadow-sm border-none">
              <CardHeader>
                <CardTitle className="text-xl">Your Recent Service Inquiries</CardTitle>
                <CardDescription>Track the status of your requests for digital growth.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {inquiriesLoading ? (
                  <div className="py-8 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-muted" /></div>
                ) : inquiries && inquiries.length > 0 ? (
                  inquiries.map((inquiry: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between p-4 rounded-xl border group hover:bg-accent/5 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          <BarChart3 className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-primary">{inquiry.service || "General Inquiry"}</p>
                          <p className="text-sm text-muted-foreground">{inquiry.businessName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-bold uppercase px-2 py-1 rounded bg-secondary text-secondary-foreground">Pending</span>
                        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-12 text-center text-muted-foreground space-y-4">
                    <p>You haven't sent any inquiries yet.</p>
                    <Link href="/contact">
                      <Button variant="outline">Start an Inquiry</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
