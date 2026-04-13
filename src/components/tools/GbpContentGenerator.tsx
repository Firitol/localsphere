
"use client";

import { useState } from "react";
import { generateGbpContent, type GenerateGbpContentOutput } from "@/ai/flows/generate-gbp-content-flow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Loader2, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function GbpContentGenerator() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerateGbpContentOutput | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const { toast } = useToast();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      const output = await generateGbpContent({
        businessName: formData.get("businessName") as string,
        businessDescription: formData.get("businessDescription") as string,
        servicesOffered: (formData.get("services") as string).split(",").map(s => s.trim()),
        targetAudience: formData.get("audience") as string,
        toneOfVoice: formData.get("tone") as string,
      });
      setResult(output);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error generating content",
        description: "Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
      <Card className="shadow-xl border-t-4 border-t-accent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent" /> Business Input
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Business Name</label>
              <Input name="businessName" placeholder="e.g. Local Sphere Bakery" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea name="businessDescription" placeholder="Tell AI about your story..." required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Services (comma separated)</label>
              <Input name="services" placeholder="e.g. Custom Cakes, Pastries, Coffee" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Target Audience</label>
                <Input name="audience" placeholder="e.g. Local families" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Tone of Voice</label>
                <Input name="tone" placeholder="e.g. Friendly, Modern" required />
              </div>
            </div>
            <Button type="submit" className="w-full bg-primary" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
              Generate GBP Assets
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {result ? (
          <>
            <Card className="bg-white">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">GBP Description</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => copyToClipboard(result.gbpDescription, 'desc')}>
                  {copied === 'desc' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </Button>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{result.gbpDescription}</p>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Optimized Services</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {result.gbpServices.map((service, i) => (
                  <div key={i} className="border-b last:border-0 pb-3 last:pb-0">
                    <h5 className="font-bold text-primary">{service.name}</h5>
                    <p className="text-sm text-muted-foreground">{service.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-accent/10 border-accent/20">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Promotional Update</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => copyToClipboard(result.promotionalPost, 'post')}>
                  {copied === 'post' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </Button>
              </CardHeader>
              <CardContent>
                <p className="text-sm italic text-primary">"{result.promotionalPost}"</p>
              </CardContent>
            </Card>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-muted/20 rounded-2xl border-2 border-dashed">
            <Sparkles className="w-12 h-12 text-muted mb-4" />
            <h3 className="font-bold text-muted-foreground">Ready to create?</h3>
            <p className="text-sm text-muted-foreground/60 max-w-xs">Enter your business details to generate AI-optimized descriptions and posts.</p>
          </div>
        )}
      </div>
    </div>
  );
}
