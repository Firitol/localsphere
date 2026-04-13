
"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Info } from "lucide-react";

const checklistItems = [
  { id: "gbp-claimed", label: "Google Business Profile Claimed & Verified", tip: "Essential for appearing in the 'Map Pack'." },
  { id: "nap-consistency", label: "Consistent Name, Address, Phone (NAP)", tip: "Google trusts businesses with matching details everywhere." },
  { id: "reviews-active", label: "Active Review Management Strategy", tip: "Recent reviews are a huge ranking factor." },
  { id: "mobile-ready", label: "Website is Mobile-Responsive", tip: "Over 80% of local searches happen on smartphones." },
  { id: "local-keywords", label: "Location-Specific Keywords on Site", tip: "Include your city name in headers and content." },
  { id: "citations", label: "Listed in High-Authority Local Directories", tip: "Think Yelp, Yellow Pages, and local industry sites." }
];

export function SeoChecklist() {
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    const next = new Set(checked);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setChecked(next);
  };

  const score = Math.round((checked.size / checklistItems.length) * 100);

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <CardTitle className="text-2xl font-bold text-primary">Local SEO Readiness</CardTitle>
          <Badge variant={score === 100 ? "default" : "secondary"}>
            {score === 100 ? "Ready to Win!" : "Room to Grow"}
          </Badge>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm font-medium">
            <span>Progress</span>
            <span>{score}%</span>
          </div>
          <Progress value={score} className="h-2" />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {checklistItems.map((item) => (
            <div key={item.id} className={`p-4 rounded-xl border-2 transition-all ${checked.has(item.id) ? 'border-accent bg-accent/5' : 'border-border'}`}>
              <div className="flex items-start gap-3">
                <Checkbox 
                  id={item.id} 
                  checked={checked.has(item.id)} 
                  onCheckedChange={() => toggle(item.id)}
                  className="mt-1"
                />
                <div className="space-y-1">
                  <label htmlFor={item.id} className="text-sm font-bold leading-none cursor-pointer">
                    {item.label}
                  </label>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Info className="w-3 h-3 text-accent" />
                    <span>{item.tip}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {score === 100 && (
          <div className="bg-green-100 text-green-800 p-4 rounded-xl flex items-center gap-3 animate-in zoom-in-95 duration-300">
            <CheckCircle2 className="w-6 h-6" />
            <div>
              <p className="font-bold">Excellent!</p>
              <p className="text-sm">Your business is perfectly positioned for local growth.</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
