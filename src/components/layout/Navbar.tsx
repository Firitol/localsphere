
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search, Globe, Menu, X } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center transition-transform group-hover:rotate-12">
            <Globe className="text-white w-5 h-5" />
          </div>
          <span className="font-headline font-bold text-xl tracking-tight text-primary">LocalSphere</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/services" className="text-sm font-medium hover:text-primary transition-colors">Services</Link>
          <Link href="/tools" className="text-sm font-medium hover:text-primary transition-colors">Tools</Link>
          <Link href="/pricing" className="text-sm font-medium hover:text-primary transition-colors">Pricing</Link>
          <Link href="/contact">
            <Button size="sm">Get Started</Button>
          </Link>
        </div>

        {/* Mobile Nav Toggle */}
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-b bg-background p-4 flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 duration-200">
          <Link href="/services" onClick={() => setIsOpen(false)} className="text-lg font-medium">Services</Link>
          <Link href="/tools" onClick={() => setIsOpen(false)} className="text-lg font-medium">Tools</Link>
          <Link href="/pricing" onClick={() => setIsOpen(false)} className="text-lg font-medium">Pricing</Link>
          <Link href="/contact" onClick={() => setIsOpen(false)}>
            <Button className="w-full">Get Started</Button>
          </Link>
        </div>
      )}
    </nav>
  );
}
