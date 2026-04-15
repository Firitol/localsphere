'use client';

import { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useAuth, useUser } from '@/firebase';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Globe, Loader2, UserPlus } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isUserLoading, router]);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      router.push('/dashboard');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Registration failed',
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  if (isUserLoading || user) {
    return (
      <div className="h-screen flex items-center justify-center bg-accent/5">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-accent/5">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl rounded-3xl overflow-hidden border-none">
          <CardHeader className="bg-primary text-primary-foreground text-center space-y-2 p-8">
             <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <Globe className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold font-headline">Join LocalSphere</CardTitle>
            <CardDescription className="text-primary-foreground/80">Start scaling your business with AI today.</CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name</label>
                <Input name="name" placeholder="John Doe" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Business Email</label>
                <Input name="email" type="email" placeholder="name@company.com" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Password</label>
                <Input name="password" type="password" placeholder="Min 6 characters" required minLength={6} />
              </div>
              <Button type="submit" className="w-full py-6 text-lg rounded-xl font-bold" disabled={loading}>
                {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <UserPlus className="w-5 h-5 mr-2" />}
                Create Account
              </Button>
            </form>
          </CardContent>
          <CardFooter className="bg-muted/50 p-6 text-center justify-center">
            <p className="text-sm text-muted-foreground">
              Already have an account? <Link href="/login" className="text-primary font-bold hover:underline">Log in</Link>
            </p>
          </CardFooter>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
