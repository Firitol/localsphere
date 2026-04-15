
'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Globe, Menu, X, User, LogOut, LayoutDashboard, Settings } from "lucide-react";
import { useState } from "react";
import { useUser, useAuth } from "@/firebase";
import { signOut } from "firebase/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, loading } = useUser();
  const auth = useAuth();

  const handleLogout = async () => {
    await signOut(auth);
  };

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
          {!user && (
            <>
              <Link href="/services" className="text-sm font-medium hover:text-primary transition-colors">Services</Link>
              <Link href="/pricing" className="text-sm font-medium hover:text-primary transition-colors">Pricing</Link>
            </>
          )}
          
          {!loading && (
            user ? (
              <div className="flex items-center gap-6">
                <Link href="/dashboard" className="text-sm font-bold text-primary flex items-center gap-2">
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10 border-2 border-primary/20">
                        <AvatarImage src={user.photoURL || undefined} alt={user.displayName || ""} />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {user.displayName?.charAt(0) || user.email?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 rounded-2xl p-2" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal p-4">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-bold leading-none">{user.displayName || "Business Owner"}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild className="rounded-xl">
                      <Link href="/dashboard/settings" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer focus:text-destructive rounded-xl">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login">
                  <Button variant="ghost" size="sm">Login</Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="rounded-xl font-bold">Try Manager Free</Button>
                </Link>
              </div>
            )
          )}
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
          <Link href="/pricing" onClick={() => setIsOpen(false)} className="text-lg font-medium">Pricing</Link>
          <div className="pt-4 border-t flex flex-col gap-2">
            {!loading && (
              user ? (
                <>
                  <Link href="/dashboard" onClick={() => setIsOpen(false)} className="text-lg font-bold">My Dashboard</Link>
                  <Button variant="outline" onClick={handleLogout} className="w-full text-destructive rounded-xl">Logout</Button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full rounded-xl">Login</Button>
                  </Link>
                  <Link href="/register" onClick={() => setIsOpen(false)}>
                    <Button className="w-full rounded-xl">Get Started</Button>
                  </Link>
                </>
              )
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
