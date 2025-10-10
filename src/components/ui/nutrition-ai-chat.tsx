"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ArrowUpIcon,
  Sparkles,
  Apple,
  UtensilsCrossed,
  Salad,
  Weight,
  Heart,
  Flame,
  TrendingUp,
  Camera,
} from "lucide-react";

interface AutoResizeProps {
  minHeight: number;
  maxHeight?: number;
}

function useAutoResizeTextarea({ minHeight, maxHeight }: AutoResizeProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = useCallback(
    (reset?: boolean) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      if (reset) {
        textarea.style.height = `${minHeight}px`;
        return;
      }

      textarea.style.height = `${minHeight}px`; // reset first
      const newHeight = Math.max(
        minHeight,
        Math.min(textarea.scrollHeight, maxHeight ?? Infinity)
      );
      textarea.style.height = `${newHeight}px`;
    },
    [minHeight, maxHeight]
  );

  useEffect(() => {
    if (textareaRef.current) textareaRef.current.style.height = `${minHeight}px`;
  }, [minHeight]);

  return { textareaRef, adjustHeight };
}

interface NutritionAiChatProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
}

export default function NutritionAiChat({ onSendMessage, isLoading = false }: NutritionAiChatProps) {
  const [message, setMessage] = useState("");
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 56,
    maxHeight: 150,
  });

  const handleSend = () => {
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage("");
      adjustHeight(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickAction = (prompt: string) => {
    setMessage(prompt);
    textareaRef.current?.focus();
  };

  return (
    <div
      className="relative w-full h-screen bg-cover bg-center flex flex-col items-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2053&auto=format&fit=crop')",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60"></div>

      {/* Centered AI Title */}
      <div className="relative z-10 flex-1 w-full flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-2 border-green-400/30 flex items-center justify-center shadow-2xl backdrop-blur-sm">
                <Apple className="h-10 w-10 sm:h-12 sm:w-12 text-green-400" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center shadow-lg">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white drop-shadow-2xl mb-4">
            NutriAI Coach
          </h1>
          <p className="text-lg sm:text-xl text-green-100 drop-shadow-lg max-w-2xl mx-auto">
            Your personal AI nutritionist — ask anything about food, diet, and health
          </p>
        </div>
      </div>

      {/* Input Box Section */}
      <div className="relative z-10 w-full max-w-4xl px-4 mb-[15vh] sm:mb-[20vh]">
        <div className="relative bg-black/40 backdrop-blur-xl rounded-2xl border border-green-500/30 shadow-2xl">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              adjustHeight();
            }}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything about nutrition, diet, or healthy eating..."
            className={cn(
              "w-full px-5 py-4 resize-none border-none",
              "bg-transparent text-white text-base",
              "focus-visible:ring-0 focus-visible:ring-offset-0",
              "placeholder:text-green-200/60 min-h-[56px]"
            )}
            style={{ overflow: "hidden" }}
            disabled={isLoading}
          />

          {/* Footer Buttons */}
          <div className="flex items-center justify-between px-4 pb-4">
            <div className="text-xs text-green-200/70">
              {isLoading ? "AI is thinking..." : "Press Enter to send, Shift+Enter for new line"}
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={handleSend}
                disabled={!message.trim() || isLoading}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200",
                  message.trim() && !isLoading
                    ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl"
                    : "bg-neutral-700 text-neutral-400 cursor-not-allowed"
                )}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span className="text-sm">Sending...</span>
                  </>
                ) : (
                  <>
                    <ArrowUpIcon className="w-4 h-4" />
                    <span className="text-sm font-medium">Send</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center justify-center flex-wrap gap-2 sm:gap-3 mt-6">
          <QuickAction
            icon={<Salad className="w-4 h-4" />}
            label="Meal Ideas"
            onClick={() => handleQuickAction("Berikan saya ide menu makanan sehat untuk hari ini")}
          />
          <QuickAction
            icon={<Flame className="w-4 h-4" />}
            label="Calorie Calculator"
            onClick={() => handleQuickAction("Bagaimana cara menghitung kebutuhan kalori harian saya?")}
          />
          <QuickAction
            icon={<Weight className="w-4 h-4" />}
            label="Weight Loss Tips"
            onClick={() => handleQuickAction("Berikan tips diet sehat untuk menurunkan berat badan")}
          />
          <QuickAction
            icon={<Heart className="w-4 h-4" />}
            label="Heart Health"
            onClick={() => handleQuickAction("Makanan apa yang baik untuk kesehatan jantung?")}
          />
          <QuickAction
            icon={<TrendingUp className="w-4 h-4" />}
            label="Muscle Building"
            onClick={() => handleQuickAction("Nutrisi apa yang diperlukan untuk membangun otot?")}
          />
          <QuickAction
            icon={<Camera className="w-4 h-4" />}
            label="Analyze Food"
            onClick={() => handleQuickAction("Bagaimana cara menganalisis nutrisi makanan dari foto?")}
          />
          <QuickAction
            icon={<UtensilsCrossed className="w-4 h-4" />}
            label="Meal Planning"
            onClick={() => handleQuickAction("Buatkan meal plan seminggu untuk diet seimbang")}
          />
          <QuickAction
            icon={<Apple className="w-4 h-4" />}
            label="Healthy Snacks"
            onClick={() => handleQuickAction("Rekomendasi camilan sehat untuk di antara waktu makan")}
          />
        </div>
      </div>
    </div>
  );
}

interface QuickActionProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

function QuickAction({ icon, label, onClick }: QuickActionProps) {
  return (
    <Button
      onClick={onClick}
      variant="outline"
      className="flex items-center gap-2 rounded-full border-green-500/40 bg-black/40 backdrop-blur-md text-green-100 hover:text-white hover:bg-green-500/30 hover:border-green-400/60 transition-all duration-200 text-xs sm:text-sm px-3 py-2 sm:px-4 shadow-lg"
    >
      {icon}
      <span>{label}</span>
    </Button>
  );
}
