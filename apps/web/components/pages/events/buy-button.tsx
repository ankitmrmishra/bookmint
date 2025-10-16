"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/ue-toast";

export function BuyButton({ price }: { price: number }) {
  const { toast } = useToast();
  return (
    <Button
      onClick={() =>
        toast({
          title: "Checkout",
          description: "Secure purchase flow coming soon.",
        })
      }
      className="rounded-lg bg-foreground text-background hover:opacity-90"
    >
      {"Buy Ticket — $" + price}
    </Button>
  );
}
