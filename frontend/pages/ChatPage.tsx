import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Sparkles, MessageSquare, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import backend from '~backend/client';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your AI nutrition assistant. I'm here to help you with any questions about nutrition, diet planning, healthy eating habits, and more. How can I assist you today?",
      isUser: false,
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Focus input on mount
    inputRef.current?.focus();
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await backend.ai.chatWithNutritionist({
        message: userMessage.content,
        context: "User is seeking nutrition advice through the chat interface."
      });

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.response,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: "Message failed to send",
        description: "Please try again. The AI assistant may be temporarily unavailable.",
        variant: "destructive",
      });

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I apologize, but I'm having trouble responding right now. Please try again in a moment. In the meantime, remember that a balanced diet with plenty of fruits, vegetables, whole grains, and lean proteins is always a good foundation!",
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestedQuestions = [
    "What are the best foods for weight loss?",
    "How much protein should I eat daily?",
    "What are healthy snack options?",
    "How can I meal prep effectively?",
    "What vitamins should I take?",
    "How do I read nutrition labels?"
  ];

  const handleSuggestedQuestion = (question: string) => {
    setInputValue(question);
    inputRef.current?.focus();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-green-600 rounded-full">
                <MessageSquare className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                AI Nutrition Coach
              </h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get instant, personalized nutrition advice from our AI-powered nutritionist. Ask anything about diet, health, or nutrition!
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-6">
            {/* Suggested Questions Sidebar */}
            <div className="lg:col-span-1 space-y-4">
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <HelpCircle className="h-5 w-5 text-blue-600" />
                    <span>Quick Questions</span>
                  </CardTitle>
                  <CardDescription>
                    Click any question to get started quickly
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {suggestedQuestions.map((question, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      className="w-full text-left h-auto p-3 text-sm justify-start hover:bg-blue-50 hover:text-blue-700 transition-colors"
                      onClick={() => handleSuggestedQuestion(question)}
                    >
                      <span className="line-clamp-2">{question}</span>
                    </Button>
                  ))}
                </CardContent>
              </Card>

              {/* AI Status */}
              <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-blue-50">
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping opacity-75"></div>
                    </div>
                    <div>
                      <p className="font-medium text-green-800">AI Assistant Online</p>
                      <p className="text-xs text-green-600">Ready to help you!</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Chat Interface */}
            <div className="lg:col-span-3">
              <Card className="h-[70vh] flex flex-col shadow-xl border-0 bg-white/90 backdrop-blur overflow-hidden">
                {/* Chat Header */}
                <div className="bg-gradient-to-r from-blue-600 to-green-600 p-4 text-white">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <Bot className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold">NutriAI Assistant</h3>
                      <p className="text-sm text-white/80">Your personal nutrition expert</p>
                    </div>
                    <div className="ml-auto">
                      <Badge variant="secondary" className="bg-white/20 text-white border-white/20">
                        <Sparkles className="h-3 w-3 mr-1" />
                        AI Powered
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <CardContent className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-gray-50/50 to-white">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`flex max-w-[85%] ${
                          message.isUser ? 'flex-row-reverse' : 'flex-row'
                        } items-start space-x-3`}
                      >
                        {/* Avatar */}
                        <div
                          className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-md ${
                            message.isUser 
                              ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' 
                              : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                          }`}
                        >
                          {message.isUser ? (
                            <User className="h-5 w-5" />
                          ) : (
                            <Bot className="h-5 w-5" />
                          )}
                        </div>

                        {/* Message Content */}
                        <div className={`space-y-1 ${message.isUser ? 'mr-3' : 'ml-3'}`}>
                          <div
                            className={`rounded-2xl px-4 py-3 shadow-sm ${
                              message.isUser
                                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                                : 'bg-white border border-gray-200 text-foreground'
                            }`}
                          >
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">
                              {message.content}
                            </p>
                          </div>
                          <p
                            className={`text-xs px-2 ${
                              message.isUser ? 'text-right text-gray-500' : 'text-left text-gray-500'
                            }`}
                          >
                            {message.timestamp.toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Typing Indicator */}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white flex items-center justify-center shadow-md">
                          <Bot className="h-5 w-5" />
                        </div>
                        <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm ml-3">
                          <div className="flex items-center space-x-2">
                            <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                            <span className="text-sm text-gray-600">AI is thinking...</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </CardContent>

                {/* Input Form */}
                <div className="border-t bg-white p-4">
                  <form onSubmit={handleSendMessage} className="flex space-x-3">
                    <div className="flex-1 relative">
                      <Input
                        ref={inputRef}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Ask me anything about nutrition..."
                        disabled={isLoading}
                        className="pr-12 py-3 rounded-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                      <Button 
                        type="submit" 
                        disabled={isLoading || !inputValue.trim()}
                        size="sm"
                        className="absolute right-1 top-1 bottom-1 px-3 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 rounded-full"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </form>
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    This AI provides general nutrition information. Always consult healthcare professionals for specific medical advice.
                  </p>
                </div>
              </Card>
            </div>
          </div>

          {/* Information Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Sparkles className="h-5 w-5 text-green-600" />
                  <span>What I Can Help With</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Meal planning and recipes</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Nutrition facts and education</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Dietary guidelines</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Healthy eating habits</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Food choices and alternatives</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-cyan-50 hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                  <span>Best Practices</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Be specific with your questions</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Mention dietary restrictions</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Ask about portion sizes</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Include your health goals</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Ask for practical tips</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-gradient-to-br from-amber-50 to-orange-50 hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <HelpCircle className="h-5 w-5 text-amber-600" />
                  <span>Important Disclaimer</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 leading-relaxed">
                  I provide general nutrition information based on scientific evidence. For specific medical conditions, allergies, or therapeutic diets, please consult with qualified healthcare professionals or registered dietitians.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
