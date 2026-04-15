
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFirestore, useUser } from "@/firebase";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function VerificationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const firestore = useFirestore();
  const { user } = useUser();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const ref = searchParams.get("ref");

  useEffect(() => {
    if (!ref || !firestore || !user) return;

    const verifyPayment = async () => {
      try {
        // Simulate API check to Chapa
        const q = query(collection(firestore, "payments"), where("transactionRef", "==", ref));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          const paymentDoc = snapshot.docs[0];
          
          // Update payment status
          await updateDoc(doc(firestore, "payments", paymentDoc.id), {
            status: "success",
            verifiedAt: new Date(),
          });

          // Update user subscription
          await updateDoc(doc(firestore, "users", user.uid), {
            subscriptionStatus: "active",
            currentPlan: paymentDoc.data().planId === 'foundation' ? 'Foundation' : 'Growth'
          });

          setStatus('success');
        } else {
          setStatus('error');
        }
      } catch (err) {
        setStatus('error');
      }
    };

    verifyPayment();
  }, [ref, firestore, user]);

  return (
    <div className="min-h-screen flex flex-col bg-accent/5">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6 p-12 bg-white rounded-3xl shadow-xl">
          {status === 'loading' && (
            <>
              <Loader2 className="w-16 h-16 text-primary animate-spin mx-auto" />
              <h1 className="text-2xl font-bold">Verifying Payment...</h1>
              <p className="text-muted-foreground">Please don't close this window while we secure your transaction.</p>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
              <h1 className="text-2xl font-bold">Payment Successful!</h1>
              <p className="text-muted-foreground">Your LocalSphere Premium subscription is now active.</p>
              <Button onClick={() => router.push("/dashboard")} className="w-full py-6 rounded-xl">
                Go to Dashboard
              </Button>
            </>
          )}

          {status === 'error' && (
            <>
              <AlertCircle className="w-16 h-16 text-destructive mx-auto" />
              <h1 className="text-2xl font-bold">Verification Failed</h1>
              <p className="text-muted-foreground">We couldn't confirm your transaction. If money was deducted, please contact support.</p>
              <div className="flex flex-col gap-2">
                <Button onClick={() => window.location.reload()} variant="outline" className="rounded-xl">Try Again</Button>
                <Button onClick={() => router.push("/contact")} className="rounded-xl">Contact Support</Button>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
