import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User,
  Minimize2,
  HelpCircle,
  FileText,
  CreditCard,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

interface ChatbotProps {
  userRole?: 'loan_officer' | 'admin';
}

const QUICK_ACTIONS = [
  {
    title: "Application Status",
    description: "Check loan application progress",
    icon: FileText,
    trigger: "application status"
  },
  {
    title: "Verification Process", 
    description: "Learn about document verification",
    icon: CheckCircle,
    trigger: "verification process"
  },
  {
    title: "Loan Types",
    description: "Information about available loans",
    icon: CreditCard,
    trigger: "loan types"
  },
  {
    title: "Processing Time",
    description: "Expected processing timelines",
    icon: Clock,
    trigger: "processing time"
  }
];

const BOT_RESPONSES = {
  greeting: {
    content: "Hello! I'm Vistaar Assistant, here to help you with loan processes and system navigation. How can I assist you today?",
    suggestions: ["Application Status", "Verification Process", "Loan Types", "System Help"]
  },
  "application status": {
    content: "I can help you understand application statuses:\n\n• **Pending** - Application received, awaiting initial review\n• **Processing** - AI verification and document analysis in progress\n• **Review** - Manual verification by loan officers\n• **Approved** - Application approved, awaiting disbursement\n• **Rejected** - Application not approved\n\nYou can track real-time progress in the Applications Queue.",
    suggestions: ["AI Processing", "Manual Verification", "View Applications"]
  },
  "verification process": {
    content: "Our verification process includes:\n\n**AI-Powered Steps:**\n• Image preprocessing and classification\n• Face matching and biometric verification\n• Document authenticity checks\n• Credit scoring and risk assessment\n\n**Manual Steps:**\n• KYC verification review\n• Income verification\n• Reference checks\n• Final approval decision\n\nThis hybrid approach ensures accuracy and speed.",
    suggestions: ["AI Agents", "Document Requirements", "KYC Process"]
  },
  "loan types": {
    content: "Vistaar Finance offers:\n\n• **Personal Loans** - For personal expenses (₹50K - ₹10L)\n• **Business Loans** - For business growth (₹1L - ₹50L)\n• **Home Loans** - For property purchase (₹5L - ₹2Cr)\n• **Vehicle Loans** - For car/bike purchase (₹1L - ₹20L)\n• **Education Loans** - For higher education (₹2L - ₹50L)\n\nEach loan type has specific eligibility criteria and documentation requirements.",
    suggestions: ["Eligibility Criteria", "Interest Rates", "Documentation"]
  },
  "processing time": {
    content: "Processing timelines:\n\n• **AI Processing** - 15-30 minutes (automated)\n• **Document Verification** - 2-4 hours\n• **Manual Review** - 1-2 business days\n• **Final Approval** - 3-5 business days\n• **Disbursement** - 1-2 business days post-approval\n\n*Total time: 5-7 business days for most applications*",
    suggestions: ["Expedite Process", "Status Updates", "Required Documents"]
  },
  "ai agents": {
    content: "Our AI system uses 4 specialized agents:\n\n• **Image Preprocessing Agent** - Cleans and categorizes documents\n• **Face Match Agent** - Verifies identity through biometric matching\n• **Document Verification Agent** - Checks authenticity and extracts data\n• **Credit Analysis Agent** - Assesses creditworthiness and risk\n\nEach agent provides confidence scores and detailed reports.",
    suggestions: ["View Processing", "Confidence Scores", "Manual Override"]
  },
  "system help": {
    content: "Navigation help:\n\n• **Dashboard** - Overview of KPIs and recent activity\n• **Applications Queue** - Manage pending applications\n• **Processing Interface** - Detailed application review\n• **Analytics** - Performance metrics and trends\n• **Customer Onboarding** - Create new applications\n\nUse the sidebar to navigate between sections.",
    suggestions: ["Keyboard Shortcuts", "User Permissions", "Settings"]
  },
  default: {
    content: "I understand you're asking about loan processes or system navigation. I can help with:\n\n• Application status and tracking\n• Verification processes and requirements\n• Loan types and eligibility\n• Processing timelines\n• System navigation\n\nPlease let me know what specific information you need!",
    suggestions: ["Application Status", "Verification Process", "Loan Types", "System Help"]
  }
};

export function Chatbot({ userRole = 'loan_officer' }: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Add initial greeting
      const greetingMessage: ChatMessage = {
        id: '1',
        type: 'bot',
        content: BOT_RESPONSES.greeting.content,
        timestamp: new Date(),
        suggestions: BOT_RESPONSES.greeting.suggestions
      };
      setMessages([greetingMessage]);
    }
  }, [isOpen, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getBotResponse = (userMessage: string): typeof BOT_RESPONSES.default => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('application') && lowerMessage.includes('status')) {
      return BOT_RESPONSES["application status"];
    }
    if (lowerMessage.includes('verification') || lowerMessage.includes('verify')) {
      return BOT_RESPONSES["verification process"];
    }
    if (lowerMessage.includes('loan') && (lowerMessage.includes('type') || lowerMessage.includes('kind'))) {
      return BOT_RESPONSES["loan types"];
    }
    if (lowerMessage.includes('time') || lowerMessage.includes('processing') || lowerMessage.includes('how long')) {
      return BOT_RESPONSES["processing time"];
    }
    if (lowerMessage.includes('ai') || lowerMessage.includes('agent')) {
      return BOT_RESPONSES["ai agents"];
    }
    if (lowerMessage.includes('help') || lowerMessage.includes('navigation') || lowerMessage.includes('system')) {
      return BOT_RESPONSES["system help"];
    }
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return BOT_RESPONSES.greeting;
    }
    
    return BOT_RESPONSES.default;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const botResponse = getBotResponse(inputValue);
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: botResponse.content,
        timestamp: new Date(),
        suggestions: botResponse.suggestions
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    setTimeout(() => handleSendMessage(), 100);
  };

  const handleQuickAction = (action: typeof QUICK_ACTIONS[0]) => {
    setInputValue(action.trigger);
    setTimeout(() => handleSendMessage(), 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50 chatbot-container">
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
          size="lg"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 chatbot-container">
      <Card className={`w-96 shadow-2xl border-blue-200 ${isMinimized ? 'h-16' : 'h-[32rem]'} transition-all duration-300`}>
        {/* Header */}
        <CardHeader className="flex flex-row items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-base">Vistaar Assistant</CardTitle>
              <p className="text-xs text-blue-100">Loan Process Helper</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-white hover:bg-white/20"
            >
              <Minimize2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        {!isMinimized && (
          <>
            {/* Messages */}
            <ScrollArea className="flex-1 p-4 h-80">
              <div className="space-y-4">
                {messages.length === 1 && (
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {QUICK_ACTIONS.map((action) => {
                      const Icon = action.icon;
                      return (
                        <Button
                          key={action.title}
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuickAction(action)}
                          className="h-auto p-3 flex flex-col items-start gap-1"
                        >
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4 text-blue-600" />
                            <span className="font-medium text-xs">{action.title}</span>
                          </div>
                          <span className="text-xs text-gray-600 text-left">{action.description}</span>
                        </Button>
                      );
                    })}
                  </div>
                )}

                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs ${message.type === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100'} rounded-lg p-3`}>
                      <div className="flex items-start gap-2 mb-2">
                        {message.type === 'bot' && (
                          <Bot className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        )}
                        {message.type === 'user' && (
                          <User className="w-4 h-4 text-white mt-0.5 flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <p className="text-sm whitespace-pre-line">{message.content}</p>
                          <p className={`text-xs mt-1 ${message.type === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                      
                      {message.suggestions && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {message.suggestions.map((suggestion, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs cursor-pointer hover:bg-blue-100 hover:text-blue-700"
                              onClick={() => handleSuggestionClick(suggestion)}
                            >
                              {suggestion}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-lg p-3 max-w-xs">
                      <div className="flex items-center gap-2">
                        <Bot className="w-4 h-4 text-blue-600" />
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input */}
            <CardContent className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about loan processes, status, or navigation..."
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
}