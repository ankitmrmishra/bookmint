import { Card } from "@/components/ui/card";
import { Ticket, Smartphone, Coins, Trophy } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: Ticket,
    title: "Buy Your Ticket",
    description:
      "Purchase tickets for your favorite concerts through our platform. Choose from thousands of events worldwide.",
    color: "text-accent",
  },
  {
    step: "02",
    icon: Smartphone,
    title: "Attend the Event",
    description:
      "Use your digital ticket to enter the venue. Enjoy the concert and create unforgettable memories.",
    color: "text-blue-500",
  },
  {
    step: "03",
    icon: Coins,
    title: "Mint as NFT",
    description:
      "After the event, instantly convert your ticket into a unique NFT collectible with one click.",
    color: "text-purple-500",
  },
  {
    step: "04",
    icon: Trophy,
    title: "Own & Trade",
    description:
      "Your NFT ticket becomes a valuable digital asset. Trade, collect, or keep as a memory forever.",
    color: "text-green-500",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 ">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 text-balance">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Transform your concert experience into digital ownership in four
            simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <Card className="p-8 text-center hover:shadow-lg transition-all duration-300 group border-border/50 hover:border-accent/50 h-full">
                <div className="mb-6">
                  <div className="text-6xl font-bold text-muted-foreground/20 mb-4">
                    {step.step}
                  </div>
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-card to-muted flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300`}
                  >
                    <step.icon className={`w-8 h-8 ${step.color}`} />
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-foreground mb-4">
                  {step.title}
                </h3>

                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </Card>

              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <div className="w-8 h-0.5 bg-gradient-to-r from-muted-foreground/50 to-accent/50"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
