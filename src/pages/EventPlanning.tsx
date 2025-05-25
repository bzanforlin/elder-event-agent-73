
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Save, Calendar, Clock, Users, ArrowLeft } from 'lucide-react';

interface Elder {
  id: number;
  name: string;
  summary?: {
    short_summary: string;
  };
}

interface ChatMessage {
  id: number;
  sender: 'user' | 'llm';
  message: string;
  timestamp: string;
}

interface Event {
  id?: number;
  title: string;
  description: string;
  date: string;
  duration_minutes: number;
  invitees: number[];
}

const EventPlanning = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const isEditing = eventId && eventId !== 'new';

  const [event, setEvent] = useState<Event>({
    title: '',
    description: '',
    date: '',
    duration_minutes: 60,
    invitees: []
  });

  const [elders, setElders] = useState<Elder[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Mock data
  useEffect(() => {
    const mockElders: Elder[] = [
      {
        id: 1,
        name: "Margaret Thompson",
        summary: { short_summary: "Enjoys quiet activities like reading and classical music. Former librarian." }
      },
      {
        id: 2,
        name: "Robert Chen",
        summary: { short_summary: "Analytical mind, enjoys chess and documentaries. Retired engineer." }
      },
      {
        id: 3,
        name: "Eleanor Davis",
        summary: { short_summary: "Social butterfly who loves group activities and music." }
      }
    ];
    setElders(mockElders);

    if (isEditing) {
      // Load existing event
      setEvent({
        title: "Classical Music Afternoon",
        description: "An afternoon of classical music featuring Mozart and Beethoven pieces",
        date: "2024-05-28T14:00",
        duration_minutes: 90,
        invitees: [1, 3]
      });

      setChatMessages([
        {
          id: 1,
          sender: 'user',
          message: 'I want to plan a music event for our residents. Can you help me decide what kind of music would be best?',
          timestamp: new Date().toISOString()
        },
        {
          id: 2,
          sender: 'llm',
          message: 'I\'d be happy to help you plan a music event! Looking at your residents, I see Margaret Thompson particularly enjoys classical music, and Eleanor Davis loves group musical activities. I recommend a classical music afternoon featuring well-known pieces like Mozart and Beethoven that would appeal to both of them. Would you like me to suggest some specific pieces and help you plan the details?',
          timestamp: new Date().toISOString()
        }
      ]);
    } else {
      setChatMessages([
        {
          id: 1,
          sender: 'llm',
          message: 'Hello! I\'m here to help you plan the perfect event for your residents. I have access to information about each elder\'s preferences and history. What kind of event are you thinking about organizing?',
          timestamp: new Date().toISOString()
        }
      ]);
    }
  }, [isEditing]);

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

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: Date.now() + 1,
        sender: 'llm',
        message: 'Based on the preferences of your residents, I suggest organizing an activity that combines their interests. For example, if you\'re planning a music event, Margaret would enjoy classical pieces while Eleanor would love the social aspect. Would you like me to help you set the date and select specific invitees for this event?',
        timestamp: new Date().toISOString()
      };

      setChatMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const toggleInvitee = (elderId: number) => {
    setEvent(prev => ({
      ...prev,
      invitees: prev.invitees.includes(elderId)
        ? prev.invitees.filter(id => id !== elderId)
        : [...prev.invitees, elderId]
    }));
  };

  const saveEvent = () => {
    // In real app, this would make API call
    console.log('Saving event:', event);
    navigate('/events');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/events')}
            className="mr-4 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Events
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditing ? 'Edit Event' : 'Plan New Event'}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chat Section */}
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-purple-800">
                <Users className="mr-2 h-5 w-5" />
                AI Event Planner
              </CardTitle>
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
                        className={`max-w-[80%] p-3 rounded-lg ${
                          message.sender === 'user'
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <p className="text-sm">{message.message}</p>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 text-gray-800 p-3 rounded-lg">
                        <p className="text-sm">AI is thinking...</p>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              <div className="flex space-x-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Ask about event planning..."
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <Button onClick={sendMessage} disabled={isLoading} className="bg-purple-600 hover:bg-purple-700">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Event Details Section */}
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-purple-800">
                <Calendar className="mr-2 h-5 w-5" />
                Event Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Event Title
                </label>
                <Input
                  value={event.title}
                  onChange={(e) => setEvent(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter event title"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Description
                </label>
                <Textarea
                  value={event.description}
                  onChange={(e) => setEvent(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the event"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Date & Time
                  </label>
                  <Input
                    type="datetime-local"
                    value={event.date}
                    onChange={(e) => setEvent(prev => ({ ...prev, date: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Duration (minutes)
                  </label>
                  <Input
                    type="number"
                    value={event.duration_minutes}
                    onChange={(e) => setEvent(prev => ({ ...prev, duration_minutes: parseInt(e.target.value) || 60 }))}
                    min="15"
                    step="15"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-3 block">
                  Invite Residents
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {elders.map((elder) => (
                    <div
                      key={elder.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        event.invitees.includes(elder.id)
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                      onClick={() => toggleInvitee(elder.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{elder.name}</p>
                          {elder.summary && (
                            <p className="text-xs text-gray-600 mt-1">
                              {elder.summary.short_summary}
                            </p>
                          )}
                        </div>
                        {event.invitees.includes(elder.id) && (
                          <Badge className="bg-purple-600">Invited</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                onClick={saveEvent}
                disabled={!event.title || !event.date}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Save className="mr-2 h-4 w-4" />
                {isEditing ? 'Update Event' : 'Save Event'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EventPlanning;
