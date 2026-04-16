import Link from "next/link";
import { Globe, Mail, MapPin, Phone, Facebook, Twitter, Instagram, Linkedin, ArrowUpRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Info */}
          <div className="space-y-8">
            <Link href="/" className="flex items-center gap-3 group w-fit">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center transition-all group-hover:rotate-12 group-hover:scale-110 shadow-lg shadow-primary/20">
                <Globe className="text-white w-6 h-6" />
              </div>
              <span className="font-headline font-black text-2xl tracking-tight transition-colors group-hover:text-accent">LocalSphere</span>
            </Link>
            <p className="text-slate-400 text-base leading-relaxed max-w-xs font-medium">
              Empowering local businesses with scalable digital solutions. Ranking you higher, everywhere.
            </p>
            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <Link 
                  key={i} 
                  href="#" 
                  className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center transition-all hover:bg-primary hover:text-white hover:-translate-y-1 border border-white/10"
                >
                  <Icon className="w-5 h-5" />
                </Link>
              ))}
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="font-black mb-8 text-white tracking-[0.15em] uppercase text-[11px] opacity-50">Quick Links</h4>
            <ul className="space-y-4 text-slate-400 font-bold">
              {[
                { label: "Services", href: "/services" },
                { label: "Free Tools", href: "/tools" },
                { label: "Pricing Plans", href: "/pricing" },
                { label: "Inquiry Form", href: "/contact" },
              ].map((link, idx) => (
                <li key={idx}>
                  <Link href={link.href} className="flex items-center gap-2 group hover:text-white transition-all">
                    <span className="group-hover:translate-x-1 transition-transform">{link.label}</span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all text-accent" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-black mb-8 text-white tracking-[0.15em] uppercase text-[11px] opacity-50">Legal & Support</h4>
            <ul className="space-y-4 text-slate-400 font-bold">
              {[
                { label: "Help Center", href: "#" },
                { label: "Privacy Policy", href: "#" },
                { label: "Terms of Service", href: "#" },
                { label: "Cookie Policy", href: "#" },
              ].map((link, idx) => (
                <li key={idx}>
                  <Link href={link.href} className="flex items-center gap-2 group hover:text-white transition-all">
                    <span className="group-hover:translate-x-1 transition-transform">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="font-black mb-8 text-white tracking-[0.15em] uppercase text-[11px] opacity-50">Contact Us</h4>
            <ul className="space-y-6 text-slate-400 font-bold">
              <li className="flex items-start gap-4 group cursor-default">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 transition-colors group-hover:bg-accent group-hover:text-primary">
                  <MapPin className="w-5 h-5" />
                </div>
                <span className="text-sm transition-colors group-hover:text-white leading-tight">Addis Ababa, Ethiopia & Global</span>
              </li>
              <li className="flex items-start gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 transition-colors group-hover:bg-accent group-hover:text-primary">
                  <Mail className="w-5 h-5" />
                </div>
                <Link href="mailto:hello@localsphere.com" className="text-sm transition-colors group-hover:text-white truncate max-w-[180px]">hello@localsphere.com</Link>
              </li>
              <li className="flex items-start gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 transition-colors group-hover:bg-accent group-hover:text-primary">
                  <Phone className="w-5 h-5" />
                </div>
                <Link href="tel:+251900000000" className="text-sm transition-colors group-hover:text-white">+251 900 000 000</Link>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center md:text-left">
            © {new Date().getFullYear()} LocalSphere Digital Services. Crafted with excellence.
          </p>
          <div className="flex gap-8 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
            <Link href="#" className="hover:text-white transition-colors">Security</Link>
            <Link href="#" className="hover:text-white transition-colors">Uptime</Link>
            <Link href="#" className="hover:text-white transition-colors">Compliance</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}