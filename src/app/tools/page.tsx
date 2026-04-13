
"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { GbpContentGenerator } from "@/components/tools/GbpContentGenerator";
import { SeoChecklist } from "@/components/tools/SeoChecklist";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Sparkles, CheckCircle2, BarChart3, Loader2 } from "lucide-react";
import { useState } from "react";
import { summarizeGbpAudit, type SummarizeGbpAuditOutput } from "@/ai/flows/summarize-gbp-audit";
import { useToast } from "@/hooks/use-toast";

export default function ToolsPage() {
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditResult, setAuditResult] = useState<SummarizeGbpAuditOutput | null>(null);
  const { toast } = useToast();

  const handleAudit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAuditLoading(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      const result = await summarizeGbpAudit({
        businessName: formData.get("businessName") as string,
        location: formData.get("location") as string,
        overallRating: 4.2, // Mocking API result
        totalReviews: 85,    // Mocking API result
        categories: ["Restaurant", "Cafe"],
        address: "123 Business St",
        reviews: ["Great coffee!", "Friendly staff, but slow service.", "Best bakery in town!"]
      });
      setAuditResult(result);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Audit Failed",
        description: "Could not fetch profile details. Ensure business name is correct.",
      });
    } finally {
      setAuditLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="bg-primary text-primary-foreground py-20">
          <div className="container mx-auto px-4 text-center space-y-4">
            <h1 className="text-4xl lg:text-6xl font-extrabold font-headline">Free Business Growth Tools</h1>
            <p className="text-xl text-primary-foreground/70 max-w-2xl mx-auto">
              Analyze your profile, generate optimized content, and track your readiness to dominate local search.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="audit" className="w-full">
              <div className="flex justify-center mb-12">
                <TabsList className="bg-muted p-1 h-auto grid grid-cols-3 w-full max-w-2xl gap-2">
                  <TabsTrigger value="audit" className="py-3 data-[state=active]:bg-primary data-[state=active]:text-white">
                    <Search className="w-4 h-4 mr-2" /> Profile Audit
                  </TabsTrigger>
                  <TabsTrigger value="content" className="py-3 data-[state=active]:bg-primary data-[state=active]:text-white">
                    <Sparkles className="w-4 h-4 mr-2" /> AI Content
                  </TabsTrigger>
                  <TabsTrigger value="checklist" className="py-3 data-[state=active]:bg-primary data-[state=active]:text-white">
                    <CheckCircle2 className="w-4 h-4 mr-2" /> Readiness
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="audit" className="space-y-8">
                <div className="max-w-4xl mx-auto">
                  <Card className="shadow-xl">
                    <CardHeader>
                      <CardTitle className="text-2xl">Instant GBP Audit Tool</CardTitle>
                      <CardDescription>Enter your business name and location to see your publicly available Google performance.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleAudit} className="flex flex-col md:flex-row gap-4">
                        <Input name="businessName" placeholder="Business Name (e.g. Starbucks)" className="flex-1" required />
                        <Input name="location" placeholder="City (e.g. New York)" className="flex-1" required />
                        <Button type="submit" className="bg-primary px-8" disabled={auditLoading}>
                          {auditLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <BarChart3 className="w-4 h-4 mr-2" />}
                          Run Audit
                        </Button>
                      </form>
                    </CardContent>
                  </Card>

                  {auditResult && (
                    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
                      <Card className="bg-green-50 border-green-200">
                        <CardHeader><CardTitle className="text-green-700 text-lg">Strengths</CardTitle></CardHeader>
                        <CardContent><ul className="list-disc pl-4 space-y-2 text-sm">{auditResult.strengths.map((s,i) => <li key={i}>{s}</li>)}</ul></CardContent>
                      </Card>
                      <Card className="bg-red-50 border-red-200">
                        <CardHeader><CardTitle className="text-red-700 text-lg">Weaknesses</CardTitle></CardHeader>
                        <CardContent><ul className="list-disc pl-4 space-y-2 text-sm">{auditResult.weaknesses.map((s,i) => <li key={i}>{s}</li>)}</ul></CardContent>
                      </Card>
                      <Card className="bg-blue-50 border-blue-200">
                        <CardHeader><CardTitle className="text-blue-700 text-lg">Suggestions</CardTitle></CardHeader>
                        <CardContent><ul className="list-disc pl-4 space-y-2 text-sm">{auditResult.suggestions.map((s,i) => <li key={i}>{s}</li>)}</ul></CardContent>
                      </Card>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="content">
                 <div className="max-w-6xl mx-auto">
                   <GbpContentGenerator />
                 </div>
              </TabsContent>

              <TabsContent value="checklist">
                <div className="max-w-4xl mx-auto">
                   <SeoChecklist />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
