"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { motion } from "framer-motion";

export default function TipsSection() {
  const tips = [
    {
      icon: "✨",
      title: "Compelling Title",
      description: "Use clear, descriptive titles that capture attention",
    },
    {
      icon: "📸",
      title: "High-Quality Image",
      description: "Use a professional image that represents your event",
    },
    {
      icon: "📝",
      title: "Detailed Description",
      description: "Provide context about what attendees will experience",
    },
    {
      icon: "⏰",
      title: "Accurate Timing",
      description: "Double-check your date and time before publishing",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full max-w-md mx-auto"
    >
      <Card className="bg-black text-white border border-white/20 shadow-md">
        {/* Header */}
        <CardHeader className="border-b border-white/20 pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            💡 Pro Tips
          </CardTitle>
          <CardDescription className="text-xs text-white/60">
            Best practices for event creation
          </CardDescription>
        </CardHeader>

        {/* Tips List */}
        <CardContent className="divide-y divide-white/10 px-0">
          {tips.map((tip, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              className="px-4 sm:px-6 py-4 hover:bg-white/10 transition-colors duration-200"
            >
              <div className="flex gap-3">
                <span className="text-xl flex-shrink-0">{tip.icon}</span>
                <div className="min-w-0">
                  <h4 className="text-sm font-semibold">{tip.title}</h4>
                  <p className="text-xs text-white/60 mt-1">
                    {tip.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </CardContent>

        {/* Footer */}
        <CardFooter className="bg-white/5 border-t border-white/10">
          <p className="text-xs text-white/70 leading-relaxed">
            <span className="font-semibold text-white">Pro Tip:</span> Events
            with complete information get 3x more engagement!
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
