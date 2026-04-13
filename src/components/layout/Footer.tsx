
import Link from "next/link";
import { Globe, Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                <Globe className="text-primary w-5 h-5" />
              </div>
              <span className="font-headline font-bold text-xl tracking-tight">LocalSphere</span>
            </div>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              Empowering local businesses with scalable digital solutions. Ranking you higher, everywhere.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><Link href="/services" className="hover:text-accent transition-colors">Services</Link></li>
              <li><Link href="/tools" className="hover:text-accent transition-colors">Free Tools</Link></li>
              <li><Link href="/pricing" className="hover:text-accent transition-colors">Pricing Plans</Link></li>
              <li><Link href="/contact" className="hover:text-accent transition-colors">Inquiry Form</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><Link href="#" className="hover:text-accent transition-colors">Help Center</Link></li>
              <li><Link href="#" className="hover:text-accent transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-accent transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-accent transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              <li className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Addis Ababa, Ethiopia & Global</li>
              <li className="flex items-center gap-2"><Mail className="w-4 h-4" /> hello@localsphere.com</li>
              <li className="flex items-center gap-2"><Phone className="w-4 h-4" /> +251 900 000 000</li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-primary-foreground/10 text-center text-xs text-primary-foreground/50">
          © {new Date().getFullYear()} LocalSphere Digital Services. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
