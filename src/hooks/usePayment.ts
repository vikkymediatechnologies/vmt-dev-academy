import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

// TEST AMOUNT (₦500)
const PAYMENT_AMOUNT = 500;

export const usePayment = () => {
  const { session, user } = useAuth();
  const [loading, setLoading] = useState(false);

  const initializePayment = async () => {
    if (!session?.access_token) {
      toast({ title: "Please log in first", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const callbackUrl = `${window.location.origin}/dashboard?verify_payment=true`;

      const res = await supabase.functions.invoke("initialize-payment", {
        body: {
          amount: PAYMENT_AMOUNT,
          callback_url: callbackUrl,
        },
      });

      if (res.error) throw new Error(res.error.message);

      const { authorization_url } = res.data;
      if (authorization_url) {
        window.location.href = authorization_url;
      } else {
        throw new Error("No authorization URL returned");
      }
    } catch (err: any) {
      console.error("Payment init error:", err);
      toast({
        title: "Payment failed",
        description: err.message || "Could not initialize payment",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const verifyPayment = async (reference: string) => {
    if (!session?.access_token || !user) return false;

    try {
      console.log("🔍 Verifying payment with reference:", reference);
      
      const res = await supabase.functions.invoke("verify-payment", {
        body: { reference },
      });

      if (res.error) throw new Error(res.error.message);

      if (res.data.verified) {
        console.log("✅ Payment verified! Activating account...");
        
        // AUTO-ACTIVATE ACCOUNT AFTER SUCCESSFUL PAYMENT
        const { error: updateError } = await supabase
          .from("enrollments")
          .update({ 
            status: "active",
            free_expires_at: null // Remove trial expiry for paid users
          })
          .eq("user_id", user.id);

        if (updateError) {
          console.error("❌ Error activating account:", updateError);
          throw new Error("Payment verified but failed to activate account");
        }

        console.log("✅ Account activated successfully!");
        
        toast({ 
          title: "🎉 Payment Successful!", 
          description: "Your account is now active with full access to all courses!"
        });
        
        return true;
      } else {
        toast({
          title: "Payment not verified",
          description: "Please try again or contact support.",
          variant: "destructive",
        });
        return false;
      }
    } catch (err: any) {
      console.error("Payment verify error:", err);
      toast({
        title: "Verification failed",
        description: err.message || "Could not verify payment",
        variant: "destructive",
      });
      return false;
    }
  };

  return { initializePayment, verifyPayment, loading, amount: PAYMENT_AMOUNT };
};