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
    <div className="min-h-screen p-6" style={{ background: 'linear-gradient(to bottom right, #AFD0CD, #EFD492)' }}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/elders')}
            className="mb-4 text-[#7F4F61] hover:text-[#7F4F61]/80"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Residents
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-[#7F4F61] mb-2">
              Chat about {elder.name}
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Elder Summary Card */}
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-l-[#7F4F61] lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center text-[#7F4F61]">
                <User className="mr-2 h-5 w-5" />
                {elder.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  {elder.summary && (
                    <div>
                      <p className="text-sm text-[#7F4F61]/70 leading-relaxed">
                        {elder.summary.short_summary}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Chat Section */}
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-l-[#7F4F61] lg:col-span-2 flex flex-col">
            <CardHeader>
              <CardTitle className="text-[#7F4F61]">
                Ask me what you'd like to know about {elder.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col flex-1 p-6 pt-0">
              <ScrollArea className="flex-1 pr-4 mb-4">
                <div className="space-y-4">
                  {chatMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] p-3 rounded-lg ${
                          message.sender === 'user'
                            ? 'bg-[#C08777] text-white'
                            : 'bg-[#AFD0CD]/20 text-[#7F4F61]'
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
                      <div className="bg-[#AFD0CD]/20 text-[#7F4F61] p-3 rounded-lg">
                        <p className="text-sm">Thinking about {elder.name}...</p>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              <div className="flex space-x-2 mt-auto pt-4 border-t border-[#AFD0CD]/30">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={`Ask about activities for ${elder.name}...`}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  className="border-[#C08777]/30 focus:border-[#C08777]"
                />
                <Button 
                  onClick={sendMessage} 
                  disabled={isLoading} 
                  className="bg-[#C08777] hover:bg-[#C08777]/90 text-white"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ElderChat;
