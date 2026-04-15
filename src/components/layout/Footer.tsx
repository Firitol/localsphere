import Link from "next/link";
import { Globe, Mail, MapPin, Phone, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 lg:gap-12 mb-12">
          <div className="space-y-6 col-span-1 sm:col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 group w-fit">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center transition-transform group-hover:rotate-12 group-hover:scale-110">
                <Globe className="text-primary w-5 h-5" />
              </div>
              <span className="font-headline font-bold text-xl tracking-tight transition-colors group-hover:text-accent">LocalSphere</span>
            </Link>
            <p className="text-primary-foreground/70 text-sm leading-relaxed max-w-xs">
              Empowering local businesses with scalable digital solutions. Ranking you higher, everywhere.
            </p>
            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <Link 
                  key={i} 
                  href="#" 
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center transition-all hover:bg-accent hover:text-primary hover:-translate-y-1"
                >
                  <Icon className="w-4 h-4" />
                </Link>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-bold mb-4 lg:mb-6 text-white tracking-wide uppercase text-xs">Quick Links</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              <li>
                <Link href="/services" className="hover:text-accent hover:translate-x-1 transition-all inline-block">Services</Link>
              </li>
              <li>
                <Link href="/tools" className="hover:text-accent hover:translate-x-1 transition-all inline-block">Free Tools</Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-accent hover:translate-x-1 transition-all inline-block">Pricing Plans</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-accent hover:translate-x-1 transition-all inline-block">Inquiry Form</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 lg:mb-6 text-white tracking-wide uppercase text-xs">Support</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              <li>
                <Link href="#" className="hover:text-accent hover:translate-x-1 transition-all inline-block">Help Center</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-accent hover:translate-x-1 transition-all inline-block">Privacy Policy</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-accent hover:translate-x-1 transition-all inline-block">Terms of Service</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-accent hover:translate-x-1 transition-all inline-block">Cookie Policy</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 lg:mb-6 text-white tracking-wide uppercase text-xs">Contact Us</h4>
            <ul className="space-y-4 text-sm text-primary-foreground/70">
              <li className="flex items-start gap-3 group">
                <div className="w-5 h-5 shrink-0 transition-colors group-hover:text-accent">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="transition-colors group-hover:text-white">Addis Ababa, Ethiopia & Global</span>
              </li>
              <li className="flex items-start gap-3 group">
                <div className="w-5 h-5 shrink-0 transition-colors group-hover:text-accent">
                  <Mail className="w-4 h-4" />
                </div>
                <Link href="mailto:hello@localsphere.com" className="transition-colors group-hover:text-white">hello@localsphere.com</Link>
              </li>
              <li className="flex items-start gap-3 group">
                <div className="w-5 h-5 shrink-0 transition-colors group-hover:text-accent">
                  <Phone className="w-4 h-4" />
                </div>
                <Link href="tel:+251900000000" className="transition-colors group-hover:text-white">+251 900 000 000</Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-primary-foreground/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[10px] text-primary-foreground/50 text-center sm:text-left">
            © {new Date().getFullYear()} LocalSphere Digital Services. All rights reserved.
          </p>
          <div className="flex gap-6 text-[10px] text-primary-foreground/50">
            <Link href="#" className="hover:text-accent transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-accent transition-colors">Terms</Link>
            <Link href="#" className="hover:text-accent transition-colors">Security</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}