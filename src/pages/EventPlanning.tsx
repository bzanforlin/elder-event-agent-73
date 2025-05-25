import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Send, Save, Calendar, Clock, Users, ArrowLeft, Plus } from 'lucide-react';

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
  const [suggestedResidents, setSuggestedResidents] = useState<number[]>([]);

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

      setSuggestedResidents([1, 3]);
    } else {
      setChatMessages([
        {
          id: 1,
          sender: 'llm',
          message: 'Hello! I\'m here to help you plan the perfect event for your residents. I have access to information about each elder\'s preferences and history. What kind of event are you thinking about organizing?',
          timestamp: new Date().toISOString()
        }
      ]);

      setSuggestedResidents([]);
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

  const handleSelectResident = (residentId: string) => {
    const id = parseInt(residentId);
    if (!event.invitees.includes(id)) {
      setEvent(prev => ({
        ...prev,
        invitees: [...prev.invitees, id]
      }));
    }
  };

  const saveEvent = () => {
    // In real app, this would make API call
    console.log('Saving event:', event);
    navigate('/events');
  };

  return (
    <div className="min-h-screen p-6" style={{ background: 'linear-gradient(to bottom right, #AFD0CD, #EFD492)' }}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/events')}
            className="mb-4 text-[#7F4F61] hover:text-[#7F4F61]/80"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Events
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-[#7F4F61] mb-2">
              {isEditing ? 'Edit Event' : 'Plan New Event'}
            </h1>
            <p className="text-[#7F4F61]">Create engaging activities for your residents</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chat Section */}
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-l-[#7F4F61] flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center text-[#7F4F61]">
                <Users className="mr-2 h-5 w-5" />
                AI Event Planner
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
                        className={`max-w-[80%] p-3 rounded-lg ${
                          message.sender === 'user'
                            ? 'bg-[#C08777] text-white'
                            : 'bg-[#AFD0CD]/20 text-[#7F4F61]'
                        }`}
                      >
                        <p className="text-sm">{message.message}</p>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-[#AFD0CD]/20 text-[#7F4F61] p-3 rounded-lg">
                        <p className="text-sm">AI is thinking...</p>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              <div className="flex space-x-2 mt-auto pt-4 border-t border-[#AFD0CD]/30">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Ask about event planning..."
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

          {/* Event Details Section */}
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-l-[#7F4F61]">
            <CardHeader>
              <CardTitle className="flex items-center text-[#7F4F61]">
                <Calendar className="mr-2 h-5 w-5" />
                Event Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-[#7F4F61] mb-2 block">
                  Event Title
                </label>
                <Input
                  value={event.title}
                  onChange={(e) => setEvent(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter event title"
                  className="border-[#C08777]/30 focus:border-[#C08777]"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-[#7F4F61] mb-2 block">
                  Description
                </label>
                <Textarea
                  value={event.description}
                  onChange={(e) => setEvent(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the event"
                  rows={3}
                  className="border-[#C08777]/30 focus:border-[#C08777]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-[#7F4F61] mb-2 block">
                    Date & Time
                  </label>
                  <Input
                    type="datetime-local"
                    value={event.date}
                    onChange={(e) => setEvent(prev => ({ ...prev, date: e.target.value }))}
                    className="border-[#C08777]/30 focus:border-[#C08777]"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-[#7F4F61] mb-2 block">
                    Duration (minutes)
                  </label>
                  <Input
                    type="number"
                    value={event.duration_minutes}
                    onChange={(e) => setEvent(prev => ({ ...prev, duration_minutes: parseInt(e.target.value) }))}
                    min="15"
                    step="15"
                    className="border-[#C08777]/30 focus:border-[#C08777]"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-[#7F4F61] mb-3 block">
                  Invite Residents
                </label>
                
                {/* Suggested Residents */}
                {suggestedResidents.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-[#7F4F61]/70 mb-2">Suggested for this event:</p>
                    <div className="space-y-2">
                      {suggestedResidents.map((residentId) => {
                        const resident = elders.find(e => e.id === residentId);
                        if (!resident) return null;
                        return (
                          <div
                            key={resident.id}
                            className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                              event.invitees.includes(resident.id)
                                ? 'border-[#7F4F61] bg-[#AFD0CD]/20'
                                : 'border-[#C08777]/30 hover:border-[#C08777]'
                            }`}
                            onClick={() => toggleInvitee(resident.id)}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium text-[#7F4F61]">{resident.name}</p>
                                {resident.summary && (
                                  <p className="text-xs text-[#7F4F61]/70 mt-1">
                                    {resident.summary.short_summary}
                                  </p>
                                )}
                              </div>
                              {event.invitees.includes(resident.id) && (
                                <Badge className="bg-[#C08777] text-white">Invited</Badge>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* All Residents Selection */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Select onValueChange={handleSelectResident}>
                      <SelectTrigger className="w-full border-[#C08777]/30 focus:border-[#C08777]">
                        <SelectValue placeholder="Select additional residents..." />
                      </SelectTrigger>
                      <SelectContent>
                        {elders
                          .filter(elder => !event.invitees.includes(elder.id))
                          .map((elder) => (
                            <SelectItem 
                              key={elder.id} 
                              value={elder.id.toString()}
                              className="text-[#7F4F61]"
                            >
                              {elder.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Selected Residents List */}
                  {event.invitees.length > 0 && (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {event.invitees.map((residentId) => {
                        const resident = elders.find(e => e.id === residentId);
                        if (!resident) return null;
                        return (
                          <div
                            key={resident.id}
                            className="p-3 border border-[#7F4F61] rounded-lg bg-[#AFD0CD]/20"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium text-[#7F4F61]">{resident.name}</p>
                                {resident.summary && (
                                  <p className="text-xs text-[#7F4F61]/70 mt-1">
                                    {resident.summary.short_summary}
                                  </p>
                                )}
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleInvitee(resident.id)}
                                className="text-[#7F4F61] hover:text-[#7F4F61]/80 hover:bg-[#AFD0CD]/30"
                              >
                                Remove
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              <Button
                onClick={saveEvent}
                disabled={!event.title || !event.date}
                className="w-full bg-[#C08777] hover:bg-[#C08777]/90 text-white"
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
