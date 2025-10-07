'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, Loader2, Bot, User, Heart, Sparkles, Apple } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

const SUGGESTION_PROMPTS = [
  "Apa makanan terbaik untuk menurunkan berat badan?",
  "Beri saran menu sarapan sehat untuk seminggu",
  "Bagaimana cara menghitung kebutuhan kalori harian?",
  "Makanan apa yang baik untuk meningkatkan energi?",
  "Beri tips diet untuk penderita diabetes",
  "Apa nutrisi yang diperlukan untuk massa otot?",
];

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: 'Halo! 👋 Saya adalah AI Nutritionist Anda. Saya siap membantu dengan pertanyaan seputar nutrisi, diet, dan kesehatan. Apa yang ingin Anda tanyakan hari ini?',
      isUser: false,
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (message?: string) => {
    const messageToSend = message || input.trim();
    if (!messageToSend || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: messageToSend,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

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
        throw new Error('Failed to get response');
      }

      const { response: reply } = await response.json();

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: reply,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: 'Maaf, terjadi kesalahan. Silakan coba lagi dalam beberapa saat.',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/20 flex items-center justify-center shadow-lg">
                <Bot className="h-8 w-8 text-primary" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                <Heart className="h-3 w-3 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-4">
            AI Nutrition Coach
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Konsultasi dengan ahli gizi AI yang siap membantu 24/7. 
            Dapatkan saran nutrisi personal yang disesuaikan dengan kebutuhan Anda.
          </p>
        </div>

        {/* Chat Container */}
        <Card className="border border-border/50 shadow-2xl bg-card/80 backdrop-blur-sm h-[600px] flex flex-col hover:shadow-3xl transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-primary to-accent text-white rounded-t-xl">
            <CardTitle className="flex items-center space-x-3 text-xl">
              <MessageCircle className="h-6 w-6" />
              <span>Chat dengan AI Nutritionist</span>
              <div className="flex items-center space-x-1 ml-auto">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-normal">Online</span>
              </div>
            </CardTitle>
          </CardHeader>
          
          {/* Messages Area */}
          <CardContent className="flex-1 overflow-hidden p-0">
            <div className="h-full overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-3 max-w-[80%] ${
                    message.isUser ? 'flex-row-reverse space-x-reverse' : ''
                  }`}>
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                      message.isUser 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500' 
                        : 'bg-gradient-to-r from-pink-500 to-rose-500'
                    }`}>
                      {message.isUser ? (
                        <User className="h-5 w-5 text-white" />
                      ) : (
                        <Bot className="h-5 w-5 text-white" />
                      )}
                    </div>
                    <div className={`p-4 rounded-2xl ${
                      message.isUser
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                        : 'bg-white border border-slate-200 text-slate-800 shadow-sm'
                    }`}>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {message.content}
                      </p>
                      <div className={`text-xs mt-2 ${
                        message.isUser ? 'text-blue-100' : 'text-slate-500'
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
                  <div className="flex items-start space-x-3 max-w-[80%]">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center">
                      <Bot className="h-5 w-5 text-white" />
                    </div>
                    <div className="p-4 rounded-2xl bg-white border border-slate-200 text-slate-800 shadow-sm">
                      <div className="flex items-center space-x-2">
                        <Loader2 className="h-4 w-4 animate-spin text-pink-500" />
                        <span className="text-sm text-slate-600">AI sedang berpikir...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </CardContent>

          {/* Input Area */}
          <div className="border-t border-slate-200 p-4 bg-slate-50/50">
            <div className="flex items-center space-x-3">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Tanyakan apa saja tentang nutrisi dan kesehatan..."
                className="flex-1 border-slate-300 focus:border-pink-500 focus:ring-pink-500"
                disabled={isLoading}
              />
              <Button
                onClick={() => handleSend()}
                disabled={!input.trim() || isLoading}
                className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white px-6"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </Card>

        {/* Suggestion Prompts */}
        <div className="mt-8">
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <Sparkles className="h-10 w-10 text-purple-600 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-slate-800 mb-2">Pertanyaan Populer</h3>
                <p className="text-slate-600">Klik salah satu untuk memulai percakapan</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {SUGGESTION_PROMPTS.map((prompt, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    onClick={() => handleSend(prompt)}
                    disabled={isLoading}
                    className="text-left justify-start h-auto p-4 border-slate-300 hover:border-pink-400 hover:bg-pink-50 text-slate-700 hover:text-pink-700"
                  >
                    <Apple className="h-4 w-4 mr-3 flex-shrink-0 text-pink-500" />
                    <span className="text-sm leading-relaxed">{prompt}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Info */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-green-50">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <h4 className="font-semibold text-slate-800 mb-2">Personalisasi AI</h4>
              <p className="text-sm text-slate-600">
                Jawaban disesuaikan dengan profil kesehatan dan tujuan diet Anda
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
              <h4 className="font-semibold text-slate-800 mb-2">24/7 Available</h4>
              <p className="text-sm text-slate-600">
                Konsultasi kapan saja tanpa perlu janji temu dengan ahli gizi
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <h4 className="font-semibold text-slate-800 mb-2">Evidence-Based</h4>
              <p className="text-sm text-slate-600">
                Saran berdasarkan penelitian ilmiah dan panduan nutrisi terbaru
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}