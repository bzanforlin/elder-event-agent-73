
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Calendar, Clock, Users, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  duration_minutes: number;
  invitees: Array<{
    id: number;
    name: string;
  }>;
  created_at: string;
}

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isNewEventOpen, setIsNewEventOpen] = useState(false);
  const navigate = useNavigate();

  // Mock data for development
  useEffect(() => {
    const mockEvents: Event[] = [
      {
        id: 1,
        title: "Classical Music Afternoon",
        description: "An afternoon of classical music featuring Mozart and Beethoven pieces",
        date: "2024-05-28T14:00:00",
        duration_minutes: 90,
        invitees: [
          { id: 1, name: "Margaret Thompson" },
          { id: 3, name: "Eleanor Davis" }
        ],
        created_at: "2024-05-25T10:00:00"
      },
      {
        id: 2,
        title: "Chess Tournament",
        description: "Weekly chess matches for strategy enthusiasts",
        date: "2024-05-30T10:00:00",
        duration_minutes: 120,
        invitees: [
          { id: 2, name: "Robert Chen" },
          { id: 4, name: "William Foster" }
        ],
        created_at: "2024-05-25T11:00:00"
      },
      {
        id: 3,
        title: "Mystery Book Club",
        description: "Discussion of 'Murder on the Orient Express' by Agatha Christie",
        date: "2024-06-02T15:30:00",
        duration_minutes: 60,
        invitees: [
          { id: 1, name: "Margaret Thompson" },
          { id: 5, name: "Dorothy Williams" }
        ],
        created_at: "2024-05-25T12:00:00"
      }
    ];
    setEvents(mockEvents);
  }, []);

  const handleCreateEvent = () => {
    navigate('/events/new');
  };

  const handleEditEvent = (eventId: number) => {
    navigate(`/events/${eventId}/edit`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (hours > 0) {
      return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
    }
    return `${remainingMinutes}m`;
  };

  const sortedEvents = [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Upcoming Events</h1>
            <p className="text-gray-600">Plan and manage activities for your residents</p>
          </div>
          
          <Button onClick={handleCreateEvent} className="bg-green-600 hover:bg-green-700 text-white">
            <Plus className="mr-2 h-4 w-4" />
            Plan New Event
          </Button>
        </div>

        <div className="space-y-4">
          {sortedEvents.map((event) => (
            <Card key={event.id} className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-l-green-500">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl text-gray-900 mb-2">{event.title}</CardTitle>
                    <p className="text-gray-600 text-sm leading-relaxed">{event.description}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditEvent(event.id)}
                    className="text-green-600 border-green-200 hover:bg-green-50"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center text-gray-700">
                    <Calendar className="h-4 w-4 mr-2 text-green-600" />
                    <div>
                      <p className="font-medium">{formatDate(event.date)}</p>
                      <p className="text-sm text-gray-500">{formatTime(event.date)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-gray-700">
                    <Clock className="h-4 w-4 mr-2 text-green-600" />
                    <span>{formatDuration(event.duration_minutes)}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-700">
                    <Users className="h-4 w-4 mr-2 text-green-600" />
                    <span>{event.invitees.length} invited</span>
                  </div>
                </div>
                
                {event.invitees.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Invited Residents:</p>
                    <div className="flex flex-wrap gap-2">
                      {event.invitees.map((invitee) => (
                        <Badge key={invitee.id} variant="secondary" className="bg-green-100 text-green-800">
                          {invitee.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
          
          {sortedEvents.length === 0 && (
            <Card className="bg-white shadow-lg text-center py-12">
              <CardContent>
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No events scheduled</h3>
                <p className="text-gray-600 mb-4">Start planning your first event for the residents</p>
                <Button onClick={handleCreateEvent} className="bg-green-600 hover:bg-green-700 text-white">
                  <Plus className="mr-2 h-4 w-4" />
                  Plan Your First Event
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Events;
