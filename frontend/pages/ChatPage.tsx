import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            AI Nutrition Coach
          </h1>
          <p className="text-lg text-muted-foreground">
            Get instant, personalized nutrition advice from our AI-powered nutritionist
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Suggested Questions Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Suggested Questions</CardTitle>
                <CardDescription>
                  Click any question to get started
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {suggestedQuestions.map((question, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      className="w-full text-left h-auto p-2 text-xs justify-start"
                      onClick={() => handleSuggestedQuestion(question)}
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-3">
            <Card className="h-[600px] flex flex-col">
              {/* Messages */}
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`flex max-w-[80%] ${
                        message.isUser ? 'flex-row-reverse' : 'flex-row'
                      } items-start space-x-2`}
                    >
                      <div
                        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                          message.isUser 
                            ? 'bg-green-600 text-white' 
                            : 'bg-blue-600 text-white'
                        }`}
                      >
                        {message.isUser ? (
                          <User className="h-4 w-4" />
                        ) : (
                          <Bot className="h-4 w-4" />
                        )}
                      </div>
                      <div
                        className={`rounded-lg px-4 py-2 ${
                          message.isUser
                            ? 'bg-green-600 text-white ml-2'
                            : 'bg-muted text-foreground mr-2'
                        }`}
                      >
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                          {message.content}
                        </p>
                        <p
                          className={`text-xs mt-1 ${
                            message.isUser ? 'text-green-100' : 'text-muted-foreground'
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
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex items-start space-x-2">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
                        <Bot className="h-4 w-4" />
                      </div>
                      <div className="bg-muted text-foreground rounded-lg px-4 py-2 mr-2">
                        <div className="flex items-center space-x-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-sm">AI is thinking...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </CardContent>

              {/* Input Form */}
              <div className="border-t p-4">
                <form onSubmit={handleSendMessage} className="flex space-x-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask me anything about nutrition..."
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button type="submit" disabled={isLoading || !inputValue.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
                <p className="text-xs text-muted-foreground mt-2">
                  This AI provides general nutrition information. Always consult healthcare professionals for specific medical advice.
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/* Information Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">What I Can Help With</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Meal planning and recipes</li>
                <li>• Nutrition facts and education</li>
                <li>• Dietary guidelines and recommendations</li>
                <li>• Healthy eating habits</li>
                <li>• Food choices and alternatives</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Important Note</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                I provide general nutrition information based on scientific evidence. For specific medical conditions, allergies, or therapeutic diets, please consult with qualified healthcare professionals.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Best Practices</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Be specific with your questions</li>
                <li>• Mention any dietary restrictions</li>
                <li>• Ask about portion sizes</li>
                <li>• Include your goals (weight loss, muscle gain, etc.)</li>
                <li>• Ask for practical tips</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
