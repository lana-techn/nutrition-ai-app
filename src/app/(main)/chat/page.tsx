'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Loader2, Bot, User, ArrowDown, ArrowUpIcon, Sparkles, Apple } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  UtensilsCrossed,
  Salad,
  Weight,
  Heart,
  Flame,
  TrendingUp,
  Camera,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

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

      textarea.style.height = `${minHeight}px`;
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

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isUserAtBottom, setIsUserAtBottom] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 56,
    maxHeight: 150,
  });

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior, block: 'end' });
    }, 100);
  };

  // Check if user is near bottom of scroll
  const checkIfAtBottom = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      return isNearBottom;
    }
    return true;
  };

  // Handle scroll to detect if user is at bottom
  const handleScroll = () => {
    const isAtBottom = checkIfAtBottom();
    setIsUserAtBottom(isAtBottom);
    setShowScrollButton(!isAtBottom);
  };

  // Only auto-scroll if user is already at bottom
  useEffect(() => {
    if (isUserAtBottom) {
      scrollToBottom();
    }
  }, [messages, isUserAtBottom]);

  const handleSend = () => {
    if (message.trim() && !isLoading) {
      handleSendMessage(message);
      setMessage('');
      adjustHeight(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickAction = (prompt: string) => {
    setMessage(prompt);
    textareaRef.current?.focus();
  };

  const handleSendMessage = async (messageToSend: string) => {
    if (!messageToSend.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: messageToSend,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    // Mark user as at bottom when sending message (they want to see response)
    setIsUserAtBottom(true);

    const startTime = Date.now();

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageToSend,
          context: `Riwayat percakapan: ${messages.slice(-3).map(m => `${m.isUser ? 'User' : 'AI'}: ${m.content}`).join('\n')}`,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `API responded with status ${response.status}`);
      }

      const { response: reply } = await response.json();
      const duration = Date.now() - startTime;

      // Only log in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`💬 Chat response received in ${(duration / 1000).toFixed(1)}s`);
      }

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: reply,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Chat request failed:', error instanceof Error ? error.message : 'Unknown error');
      }
      
      // Better error message
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      const isQuotaError = errorMsg.includes('quota') || errorMsg.includes('429');
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: isQuotaError 
          ? 'Maaf, sistem sedang sibuk karena banyaknya permintaan. Silakan coba lagi dalam beberapa saat atau refresh halaman. 🙏'
          : 'Maaf, terjadi kesalahan saat memproses permintaan Anda. Silakan coba lagi. 😔',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="relative w-full min-h-screen bg-cover bg-center flex flex-col pt-20 sm:pt-24"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2053&auto=format&fit=crop')",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/70"></div>

      {/* Content Container */}
      <div className="relative z-10 flex-1 flex flex-col">
        {/* Header - Always visible */}
        {messages.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-accent/30 to-success/30 border-2 border-accent/50 flex items-center justify-center shadow-2xl backdrop-blur-md">
                    <Apple className="h-10 w-10 sm:h-12 sm:w-12 text-accent" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-primary to-highlight rounded-full flex items-center justify-center shadow-lg">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                </div>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white drop-shadow-2xl mb-4 font-[family-name:var(--font-geist-sans)]">
                NutriAI Coach
              </h1>
              <p className="text-lg sm:text-xl text-white/90 drop-shadow-lg max-w-2xl mx-auto font-medium">
                Your personal AI nutritionist — ask anything about food, diet, and health
              </p>
            </div>

            {/* Quick Actions - Only show when no messages */}
            <div className="flex items-center justify-center flex-wrap gap-2 sm:gap-3 mb-12 max-w-4xl">
              <QuickActionButton
                icon={<Salad className="w-4 h-4" />}
                label="Meal Ideas"
                onClick={() => handleQuickAction("Berikan saya ide menu makanan sehat untuk hari ini")}
              />
              <QuickActionButton
                icon={<Flame className="w-4 h-4" />}
                label="Calorie Calculator"
                onClick={() => handleQuickAction("Bagaimana cara menghitung kebutuhan kalori harian saya?")}
              />
              <QuickActionButton
                icon={<Weight className="w-4 h-4" />}
                label="Weight Loss Tips"
                onClick={() => handleQuickAction("Berikan tips diet sehat untuk menurunkan berat badan")}
              />
              <QuickActionButton
                icon={<Heart className="w-4 h-4" />}
                label="Heart Health"
                onClick={() => handleQuickAction("Makanan apa yang baik untuk kesehatan jantung?")}
              />
              <QuickActionButton
                icon={<TrendingUp className="w-4 h-4" />}
                label="Muscle Building"
                onClick={() => handleQuickAction("Nutrisi apa yang diperlukan untuk membangun otot?")}
              />
              <QuickActionButton
                icon={<Camera className="w-4 h-4" />}
                label="Analyze Food"
                onClick={() => handleQuickAction("Bagaimana cara menganalisis nutrisi makanan dari foto?")}
              />
              <QuickActionButton
                icon={<UtensilsCrossed className="w-4 h-4" />}
                label="Meal Planning"
                onClick={() => handleQuickAction("Buatkan meal plan seminggu untuk diet seimbang")}
              />
              <QuickActionButton
                icon={<Apple className="w-4 h-4" />}
                label="Healthy Snacks"
                onClick={() => handleQuickAction("Rekomendasi camilan sehat untuk di antara waktu makan")}
              />
            </div>
          </div>
        )}

        {/* Messages Area - Show when there are messages */}
        {messages.length > 0 && (
          <div 
            ref={messagesContainerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto px-4 py-6"
          >
            <div className="max-w-4xl mx-auto space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-3 max-w-[85%] sm:max-w-[75%] ${
                    message.isUser ? 'flex-row-reverse space-x-reverse' : ''
                  }`}>
                    <div className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-lg ${
                      message.isUser 
                        ? 'bg-gradient-to-br from-highlight to-primary' 
                        : 'bg-gradient-to-br from-accent to-success'
                    }`}>
                      {message.isUser ? (
                        <User className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                      ) : (
                        <Bot className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                      )}
                    </div>
                    <div className={`p-3 sm:p-4 rounded-xl shadow-sm ${
                      message.isUser
                        ? 'bg-gradient-to-br from-highlight to-primary text-white'
                        : 'bg-card border border-border text-card-foreground'
                    }`}>
                      <div className={`text-sm leading-relaxed prose prose-sm max-w-none ${
                        message.isUser 
                          ? 'prose-invert prose-headings:text-white prose-p:text-white prose-strong:text-white prose-li:text-white' 
                          : 'prose-slate dark:prose-invert prose-headings:text-slate-900 dark:prose-headings:text-slate-100 prose-p:text-slate-800 dark:prose-p:text-slate-200'
                      }`}>
                        <ReactMarkdown 
                          remarkPlugins={[remarkGfm]}
                          components={{
                            ul: ({node, ...props}) => <ul className="list-disc list-inside space-y-1 my-2" {...props} />,
                            ol: ({node, ...props}) => <ol className="list-decimal list-inside space-y-1 my-2" {...props} />,
                            li: ({node, ...props}) => <li className="ml-2" {...props} />,
                            p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                            h1: ({node, ...props}) => <h1 className="text-lg font-bold mb-2 mt-3" {...props} />,
                            h2: ({node, ...props}) => <h2 className="text-base font-bold mb-2 mt-3" {...props} />,
                            h3: ({node, ...props}) => <h3 className="text-sm font-bold mb-1 mt-2" {...props} />,
                            strong: ({node, ...props}) => <strong className="font-bold" {...props} />,
                            code: ({node, inline, ...props}: any) => 
                              inline 
                                ? <code className={message.isUser ? "bg-white/20 px-1 py-0.5 rounded text-xs" : "bg-accent-light dark:bg-accent/20 text-accent dark:text-accent-light px-1 py-0.5 rounded text-xs font-semibold"} {...props} />
                                : <code className={message.isUser ? "block bg-white/20 p-2 rounded my-2 text-xs overflow-x-auto" : "block bg-muted p-2 rounded my-2 text-xs overflow-x-auto"} {...props} />,
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      </div>
                      <div className={`text-xs mt-2 ${
                        message.isUser ? 'text-white/80' : 'text-muted-foreground'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-3 max-w-[75%]">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-accent to-success flex items-center justify-center shadow-lg">
                      <Bot className="h-5 w-5 text-white" />
                    </div>
                    <div className="p-4 rounded-xl bg-card border border-border shadow-sm">
                      <div className="flex items-center space-x-2">
                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                        <span className="text-sm text-card-foreground font-medium">AI sedang berpikir...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Scroll to Bottom Button */}
            {showScrollButton && (
              <button
                onClick={() => {
                  setIsUserAtBottom(true);
                  scrollToBottom('smooth');
                }}
                className="fixed bottom-32 right-6 bg-gradient-to-br from-primary to-highlight text-white p-3 rounded-full shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-200 z-20"
                aria-label="Scroll to bottom"
              >
                <ArrowDown className="h-5 w-5" />
              </button>
            )}
          </div>
        )}

        {/* Input Area - Always at bottom */}
        <div className="w-full px-4 pb-6 sm:pb-8">
          <div className="max-w-4xl mx-auto">
            <div className="relative bg-card backdrop-blur-xl rounded-xl border border-border shadow-lg">
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
                  "bg-transparent text-card-foreground text-base",
                  "focus-visible:ring-0 focus-visible:ring-offset-0",
                  "placeholder:text-muted-foreground min-h-[56px]"
                )}
                style={{ overflow: "hidden" }}
                disabled={isLoading}
              />

              {/* Footer Buttons */}
              <div className="flex items-center justify-between px-4 pb-4">
                <div className="text-xs text-muted-foreground font-medium">
                  {isLoading ? "AI is thinking..." : "Press Enter to send, Shift+Enter for new line"}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    onClick={handleSend}
                    disabled={!message.trim() || isLoading}
                    className={cn(
                      "flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all duration-200 font-semibold shadow-sm",
                      message.trim() && !isLoading
                        ? "bg-primary hover:bg-primary/90 text-primary-foreground hover:shadow-md hover:scale-105"
                        : "bg-muted text-muted-foreground cursor-not-allowed"
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
                        <span className="text-sm">Send</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
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

function QuickActionButton({ icon, label, onClick }: QuickActionProps) {
  return (
    <Button
      onClick={onClick}
      variant="outline"
      className="flex items-center gap-2 rounded-full border border-border bg-card/90 backdrop-blur-md text-card-foreground hover:text-primary-foreground hover:bg-primary hover:border-primary transition-all duration-200 text-xs sm:text-sm px-3 py-2 sm:px-4 shadow-sm hover:shadow-md hover:scale-105 font-medium"
    >
      {icon}
      <span>{label}</span>
    </Button>
  );
}
