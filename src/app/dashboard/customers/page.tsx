
"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Loader2, 
  Users, 
  Search, 
  Plus, 
  MoreVertical, 
  Phone, 
  Mail, 
  Filter,
  UserPlus
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { collection, query, addDoc, serverTimestamp, orderBy, limit, where, onSnapshot } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export default function CustomersPage() {
  const { user, isUserLoading: loading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [businessId, setBusinessId] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  // Find user's business
  useEffect(() => {
    if (!user || !firestore) return;
    const q = query(
      collection(firestore, "businesses"), 
      where("ownerUid", "==", user.uid), 
      limit(1)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        setBusinessId(snapshot.docs[0].id);
      }
    }, (error) => {
      const contextualError = new FirestorePermissionError({
        path: 'businesses',
        operation: 'list',
      });
      errorEmitter.emit('permission-error', contextualError);
    });
    return unsubscribe;
  }, [user, firestore]);

  const customersQuery = useMemoFirebase(() => {
    if (!firestore || !businessId || !user) return null;
    return query(
      collection(firestore, "businesses", businessId, "customers"), 
      where("ownerUid", "==", user.uid),
      orderBy("createdAt", "desc"),
      limit(50)
    );
  }, [firestore, businessId, user]);

  const { data: customers, isLoading: customersLoading } = useCollection(customersQuery);

  const filteredCustomers = (customers || []).filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (c.email && c.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddCustomer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user || !firestore) return;

    if (!businessId) {
      toast({
        variant: "destructive",
        title: "Setup Required",
        description: "Please complete your Business Profile first so we know where to save your customers.",
      });
      return;
    }

    setAddLoading(true);
    const formData = new FormData(e.currentTarget);
    
    const customerData = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      notes: formData.get("notes"),
      status: "lead",
      ownerUid: user.uid,
      createdAt: serverTimestamp(),
    };

    const customersRef = collection(firestore, "businesses", businessId, "customers");

    addDoc(customersRef, customerData)
      .then(() => {
        addDoc(collection(firestore, "businesses", businessId, "activities"), {
          type: "Customer Added",
          content: `New customer ${customerData.name} was added to the CRM.`,
          ownerUid: user.uid,
          timestamp: serverTimestamp()
        });
        toast({ title: "Customer Added", description: "The record has been created successfully." });
        setIsAddOpen(false);
      })
      .catch(async (error) => {
        const permissionError = new FirestorePermissionError({
          path: customersRef.path,
          operation: 'create',
          requestResourceData: customerData,
        });
        errorEmitter.emit('permission-error', permissionError);
      })
      .finally(() => setAddLoading(false));
  };

  if (loading || !user) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <div className="min-h-screen flex flex-col bg-accent/5">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 mb-8">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-primary font-headline flex items-center gap-3">
              <Users className="w-8 h-8 text-accent" /> Customer CRM
            </h1>
            <p className="text-muted-foreground">Manage your local relationships and track leads.</p>
          </div>
          
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-xl px-6 py-6 shadow-lg bg-primary hover:bg-primary/90" disabled={!businessId}>
                <UserPlus className="w-5 h-5 mr-2" /> Add Customer
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] rounded-3xl">
              <DialogHeader>
                <DialogTitle>New Customer Profile</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddCustomer} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <Input name="name" placeholder="John Doe" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input name="email" type="email" placeholder="john@email.com" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phone</label>
                    <Input name="phone" placeholder="+123456789" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Notes</label>
                  <Textarea name="notes" placeholder="Any specific requirements or interests..." />
                </div>
                <DialogFooter className="pt-4">
                  <Button type="submit" className="w-full py-6 rounded-xl" disabled={addLoading}>
                    {addLoading ? <Loader2 className="animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                    Save Customer
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {!businessId && !customersLoading && (
          <Card className="mb-8 border-dashed border-2 bg-yellow-50 border-yellow-200 rounded-3xl">
            <CardContent className="p-6 text-center space-y-4">
              <p className="text-yellow-800 font-medium">To start adding customers, you first need to set up your Business Profile.</p>
              <Button onClick={() => router.push('/dashboard/business')} variant="outline" className="rounded-xl">
                Go to Business Profile
              </Button>
            </CardContent>
          </Card>
        )}

        <Card className="rounded-3xl border-none shadow-sm mb-8">
          <CardHeader className="p-6 border-b">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Search by name or email..." 
                  className="pl-10 rounded-xl" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" className="rounded-xl w-full sm:w-auto">
                <Filter className="w-4 h-4 mr-2" /> Filter
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-muted/30 border-b text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Contact</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Added On</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {customersLoading ? (
                    <tr><td colSpan={5} className="py-20 text-center"><Loader2 className="animate-spin inline text-primary" /></td></tr>
                  ) : filteredCustomers.length > 0 ? (
                    filteredCustomers.map((c, i) => (
                      <tr key={i} className="hover:bg-accent/5 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                              {c.name.charAt(0)}
                            </div>
                            <span className="font-bold text-primary">{c.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col text-sm text-muted-foreground">
                            {c.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {c.phone}</span>}
                            {c.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {c.email}</span>}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-block px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-bold uppercase tracking-wider">
                            {c.status || "Lead"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          {c.createdAt?.toDate ? c.createdAt.toDate().toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button variant="ghost" size="icon" className="rounded-full">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-20 text-center text-muted-foreground">
                        {searchTerm ? "No customers match your search." : "Your customer list is empty."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
