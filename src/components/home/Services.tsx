
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { MapPin, Search, Layout, Share2, Star, Briefcase } from "lucide-react";

const services = [
  {
    title: "Google Business Profile",
    description: "Expert setup and monthly optimization to keep you on the map.",
    icon: MapPin,
    color: "bg-blue-500",
  },
  {
    title: "Local SEO Dominance",
    description: "Rank for the searches your customers are making right now.",
    icon: Search,
    color: "bg-green-500",
  },
  {
    title: "Digital Business Presence",
    description: "Simple, fast, and high-converting business websites.",
    icon: Layout,
    color: "bg-purple-500",
  },
  {
    title: "Reputation Management",
    description: "Automate reviews and keep your brand's reputation shining.",
    icon: Star,
    color: "bg-yellow-500",
  },
  {
    title: "Digital Marketing",
    description: "Targeted local posts, offers, and regular business updates.",
    icon: Share2,
    color: "bg-cyan-500",
  },
  {
    title: "Directory Listings",
    description: "Consistent business information across all major directories.",
    icon: Briefcase,
    color: "bg-orange-500",
  }
];

export function Services() {
  return (
    <section className="py-24 bg-white/50 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="font-headline text-3xl lg:text-5xl font-bold text-primary">Comprehensive Digital Services</h2>
          <p className="text-muted-foreground text-lg">
            Every local business needs a digital edge. We provide the tools and expertise to build it.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, idx) => (
            <Card key={idx} className="group hover:shadow-xl transition-all duration-300 border-none shadow-sm bg-background">
              <CardHeader>
                <div className={`w-12 h-12 rounded-xl ${service.color} flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                  <service.icon className="text-white w-6 h-6" />
                </div>
                <CardTitle className="text-xl font-bold text-primary">{service.title}</CardTitle>
                <CardDescription className="text-base text-muted-foreground pt-2">
                  {service.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-2 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent" /> Data-driven strategies
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent" /> Monthly reporting
                  </li>
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
