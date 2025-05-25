
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, ArrowLeft, User } from 'lucide-react';

interface Elder {
  id: number;
  name: string;
  summary?: {
    short_summary: string;
    long_summary: string;
  };
}

interface ChatMessage {
  id: number;
  sender: 'user' | 'llm';
  message: string;
  timestamp: string;
}

const ElderChat = () => {
  const { elderId } = useParams();
  const navigate = useNavigate();
  
  const [elder, setElder] = useState<Elder | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Mock data - in real app, fetch from API
    const mockElder: Elder = {
      id: parseInt(elderId || '1'),
      name: "Margaret Thompson",
      summary: {
        short_summary: "Margaret enjoys quiet activities like reading and listening to classical music. She has mobility limitations but is very social.",
        long_summary: "Margaret Thompson is a retired librarian who spent 40 years working at the local public library. She has a deep love for mystery novels, particularly Agatha Christie, and enjoys classical music, especially Beethoven and Mozart. She has some mobility issues but remains mentally sharp and enjoys social interaction. She often shares stories about her library work and the many people she helped over the years."
      }
    };
    
    setElder(mockElder);
    
    // Mock initial chat messages
    setChatMessages([
      {
        id: 1,
        sender: 'llm',
        message: `Hello! I'm here to help you plan activities for ${mockElder.name}. I have detailed information about her preferences and background. What would you like to know or plan for her?`,
        timestamp: new Date().toISOString()
      }
    ]);
  }, [elderId]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      sender: 'user',
      message: newMessage,
      timestamp: new Date().toISOString()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsLoading(true);

    // Simulate AI response based on elder's preferences
    setTimeout(() => {
      let aiResponse = '';
      
      if (newMessage.toLowerCase().includes('activity') || newMessage.toLowerCase().includes('activities')) {
        aiResponse = `Based on Margaret's profile, I recommend activities that combine her love for literature and classical music. She would enjoy:

• A classical music listening session with Beethoven or Mozart
• A mystery book discussion group
• Quiet reading time in a comfortable setting
• Storytelling sessions where she can share her library experiences

Given her mobility limitations, seated activities work best. She's very social, so group activities where she can interact with others would be ideal.`;
      } else if (newMessage.toLowerCase().includes('music')) {
        aiResponse = `Margaret has a particular love for classical music, especially Beethoven and Mozart. She would enjoy:

• Classical music concerts or listening sessions
• Musical discussions about her favorite composers
• Light musical activities that don't require mobility
• Group singing of familiar classical pieces

Her background as a librarian means she might also appreciate learning about the history and stories behind the compositions.`;
      } else if (newMessage.toLowerCase().includes('book') || newMessage.toLowerCase().includes('read')) {
        aiResponse = `Margaret's passion for mystery novels, especially Agatha Christie, makes her perfect for:

• Mystery book club discussions
• Reading aloud sessions
• Audiobook listening groups
• Literary trivia games
• Sharing stories about her favorite books from her library career

She could even lead discussions given her extensive background with books and helping library patrons.`;
      } else {
        aiResponse = `Based on Margaret's profile as a former librarian who loves mystery novels and classical music, I can suggest personalized activities for her. She's socially engaged despite mobility limitations. What specific type of activity or event are you thinking about? I can provide detailed recommendations tailored to her interests and abilities.`;
      }

      const aiMessage: ChatMessage = {
        id: Date.now() + 1,
        sender: 'llm',
        message: aiResponse,
        timestamp: new Date().toISOString()
      };

      setChatMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };

  if (!elder) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/elders')}
            className="mr-4 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Elders
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">
            Chat about {elder.name}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Elder Summary Card */}
          <Card className="bg-white shadow-lg lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center text-amber-800">
                <User className="mr-2 h-5 w-5" />
                Elder Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">{elder.name}</h3>
                  {elder.summary && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Summary:</p>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {elder.summary.short_summary}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Chat Section */}
          <Card className="bg-white shadow-lg lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-amber-800">
                Activity Planning Assistant
              </CardTitle>
              <p className="text-sm text-gray-600">
                Ask me about suitable activities for {elder.name}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <ScrollArea className="h-96 pr-4">
                <div className="space-y-4">
                  {chatMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] p-3 rounded-lg ${
                          message.sender === 'user'
                            ? 'bg-amber-600 text-white'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <p className="text-sm leading-relaxed whitespace-pre-line">
                          {message.message}
                        </p>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 text-gray-800 p-3 rounded-lg">
                        <p className="text-sm">Thinking about {elder.name}...</p>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              <div className="flex space-x-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={`Ask about activities for ${elder.name}...`}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <Button 
                  onClick={sendMessage} 
                  disabled={isLoading} 
                  className="bg-amber-600 hover:bg-amber-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>

              <div className="border-t pt-4">
                <p className="text-xs text-gray-500 mb-2">Quick suggestions:</p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setNewMessage("What activities would be good for Margaret?")}
                    className="text-xs"
                  >
                    Suggest activities
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setNewMessage("What music would Margaret enjoy?")}
                    className="text-xs"
                  >
                    Music preferences
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setNewMessage("What books would interest Margaret?")}
                    className="text-xs"
                  >
                    Reading interests
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ElderChat;
