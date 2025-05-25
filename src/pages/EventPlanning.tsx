import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Send,
  Save,
  Calendar,
  Clock,
  Users,
  ArrowLeft,
  Plus,
} from "lucide-react";
import {
  elderApi,
  eventApi,
  chatApi,
  Elder,
  Event,
  ChatMessage,
} from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface EventForm {
  title: string;
  description: string;
  date: string;
  duration_minutes: number;
  invitees: number[];
}

const EventPlanning = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditing = eventId && eventId !== "new";

  const [event, setEvent] = useState<EventForm>({
    title: "",
    description: "",
    date: "",
    duration_minutes: 60,
    invitees: [],
  });

  const [elders, setElders] = useState<Elder[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [suggestedResidents, setSuggestedResidents] = useState<number[]>([]);
  const [lastMessageCount, setLastMessageCount] = useState(0);
  const [lastEventUpdate, setLastEventUpdate] = useState<string>("");

  // Load data from API
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoadingData(true);

        // Load elders
        const eldersData = await elderApi.list();
        setElders(eldersData);

        if (isEditing && eventId) {
          // Load existing event
          const eventData = await eventApi.get(parseInt(eventId));

          // Convert event data to form format
          const eventDate = new Date(eventData.date);
          const formattedDate = eventDate.toISOString().slice(0, 16); // Format for datetime-local input

          setEvent({
            title: eventData.title,
            description: eventData.description,
            date: formattedDate,
            duration_minutes: eventData.duration_minutes,
            invitees: eventData.invitees?.map((inv) => inv.elder) || [],
          });

          // Initialize event update tracking
          setLastEventUpdate(JSON.stringify(eventData.invitees));

          // Load existing chat messages
          try {
            const messages = await chatApi.getEventMessages(parseInt(eventId));
            if (messages.length > 0) {
              setChatMessages(messages);
              setLastMessageCount(messages.length);
            } else {
              // Initialize with welcome message if no chat history
              setChatMessages([
                {
                  id: 1,
                  sender: "llm",
                  message: `I can see you're editing the event "${eventData.title}". I'm here to help you make any adjustments or improvements. What would you like to change about this event?`,
                  timestamp: new Date().toISOString(),
                },
              ]);
            }
          } catch (error) {
            console.error("Error loading chat messages:", error);
            // Fallback to welcome message
            setChatMessages([
              {
                id: 1,
                sender: "llm",
                message: `I can see you're editing the event "${eventData.title}". I'm here to help you make any adjustments or improvements. What would you like to change about this event?`,
                timestamp: new Date().toISOString(),
              },
            ]);
          }
        } else {
          // Initialize chat for new event
          setChatMessages([
            {
              id: 1,
              sender: "llm",
              message:
                "Hello! I'm here to help you plan the perfect event for your residents. I can provide general guidance now, but once you save this event with a title and description, I'll have full access to resident preferences and can give you personalized recommendations. What kind of event are you thinking about organizing?",
              timestamp: new Date().toISOString(),
            },
          ]);
        }
      } catch (error) {
        console.error("Error loading data:", error);
        toast({
          title: "Error",
          description: "Failed to load data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingData(false);
      }
    };

    loadData();
  }, [isEditing, eventId, toast]);

  // Polling for new messages and event updates (only for existing events)
  useEffect(() => {
    if (!isEditing || !eventId) return;

    const pollForUpdates = async () => {
      try {
        // Poll for new messages
        const messages = await chatApi.getEventMessages(parseInt(eventId));
        if (messages.length > lastMessageCount) {
          setChatMessages(messages);
          setLastMessageCount(messages.length);
        }

        // Poll for event updates (invitees changes)
        const eventData = await eventApi.get(parseInt(eventId));
        const currentEventUpdate = JSON.stringify(eventData.invitees);

        if (lastEventUpdate && currentEventUpdate !== lastEventUpdate) {
          // Event invitees have changed, update the form
          setEvent((prev) => ({
            ...prev,
            invitees: eventData.invitees?.map((inv) => inv.elder) || [],
          }));

          toast({
            title: "Event Updated",
            description:
              "The invitation list has been updated by the AI assistant.",
          });
        }

        if (!lastEventUpdate) {
          // First time setting the event update state
          setLastEventUpdate(currentEventUpdate);
        } else if (currentEventUpdate !== lastEventUpdate) {
          setLastEventUpdate(currentEventUpdate);
        }
      } catch (error) {
        console.error("Error polling for updates:", error);
      }
    };

    const interval = setInterval(pollForUpdates, 3000); // Poll every 3 seconds
    return () => clearInterval(interval);
  }, [isEditing, eventId, lastMessageCount, lastEventUpdate, toast]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const messageText = newMessage;
    setNewMessage(""); // Clear input immediately

    // For new events, we can't send real messages yet, so provide helpful guidance
    if (!isEditing || !eventId) {
      const userMessage: ChatMessage = {
        id: Date.now(),
        sender: "user",
        message: messageText,
        timestamp: new Date().toISOString(),
      };

      setChatMessages((prev) => [...prev, userMessage]);

      // Provide helpful guidance for new events
      setTimeout(() => {
        let aiResponse = "";

        if (messageText.toLowerCase().includes("music")) {
          aiResponse =
            "Great choice! Music events are wonderful for bringing residents together. I'd recommend setting up a comfortable space with good acoustics. Once you save this event, I'll be able to help you find residents who particularly enjoy music and suggest specific songs or activities based on their preferences.";
        } else if (
          messageText.toLowerCase().includes("game") ||
          messageText.toLowerCase().includes("activity")
        ) {
          aiResponse =
            "Games and activities are excellent for cognitive stimulation and social interaction! Consider the mobility levels of your residents when planning. After you save this event, I can help identify residents who would most enjoy this type of activity and suggest modifications to make it accessible for everyone.";
        } else if (
          messageText.toLowerCase().includes("food") ||
          messageText.toLowerCase().includes("meal")
        ) {
          aiResponse =
            "Food-related events are always popular! Consider dietary restrictions and preferences. Once you create this event, I'll be able to help you find residents with specific dietary needs or food preferences to ensure everyone can participate safely.";
        } else {
          aiResponse =
            "That sounds like a wonderful idea! To give you the best recommendations for residents and activities, I'll need you to first save this event with a title and description. Once the event is created, I can access detailed information about each resident's preferences and help you plan the perfect event for them.";
        }

        const aiMessage: ChatMessage = {
          id: Date.now() + 1,
          sender: "llm",
          message: aiResponse,
          timestamp: new Date().toISOString(),
        };

        setChatMessages((prev) => [...prev, aiMessage]);
      }, 1500);
      return;
    }

    // For existing events, use real API
    try {
      const userMessage = await chatApi.sendEventMessage(
        parseInt(eventId),
        messageText,
        "user"
      );

      // Add the user message immediately
      setChatMessages((prev) => [...prev, userMessage]);
      setLastMessageCount((prev) => prev + 1);

      // The AI response will be generated automatically by the backend
      // and picked up by our polling mechanism
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
      // Restore the message text if there was an error
      setNewMessage(messageText);
    }
  };

  const toggleInvitee = (elderId: number) => {
    setEvent((prev) => ({
      ...prev,
      invitees: prev.invitees.includes(elderId)
        ? prev.invitees.filter((id) => id !== elderId)
        : [...prev.invitees, elderId],
    }));
  };

  const handleSelectResident = (residentId: string) => {
    const id = parseInt(residentId);
    if (!event.invitees.includes(id)) {
      setEvent((prev) => ({
        ...prev,
        invitees: [...prev.invitees, id],
      }));
    }
  };

  const saveEvent = async () => {
    if (!event.title || !event.date) return;

    setIsSaving(true);

    try {
      if (isEditing && eventId) {
        // Update existing event
        await eventApi.update(parseInt(eventId), {
          title: event.title,
          description: event.description,
          date: new Date(event.date).toISOString(),
          duration_minutes: event.duration_minutes,
        });

        // Handle invitees separately - this is a simplified approach
        // In a real app, you might want to compare current vs new invitees
        // and only add/remove the differences
        toast({
          title: "Success!",
          description: "Event updated successfully.",
        });

        // Stay on the same page for updates
      } else {
        // Create new event
        const newEvent = await eventApi.create({
          title: event.title,
          description: event.description,
          date: new Date(event.date).toISOString(),
          duration_minutes: event.duration_minutes,
        });

        // Add invitees to the new event
        if (event.invitees.length > 0 && newEvent.id) {
          for (const elderId of event.invitees) {
            try {
              await eventApi.addInvitee(newEvent.id, elderId);
            } catch (error) {
              console.error(`Error adding invitee ${elderId}:`, error);
            }
          }
        }

        toast({
          title: "Success!",
          description: "Event created successfully.",
        });

        // Send initial welcome message to the new event's chat
        if (newEvent.id) {
          try {
            await chatApi.sendEventMessage(
              newEvent.id,
              "Hello! I'm here to help you plan the perfect event for your residents. I have access to information about each elder's preferences and history. What kind of event are you thinking about organizing?",
              "llm"
            );
          } catch (error) {
            console.error("Error sending initial chat message:", error);
          }
        }

        // Navigate to the newly created event's edit page
        navigate(`/events/${newEvent.id}/edit`);
      }
    } catch (error) {
      console.error("Error saving event:", error);
      toast({
        title: "Error",
        description: "Failed to save event. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="min-h-screen p-6"
      style={{
        background: "linear-gradient(to bottom right, #AFD0CD, #EFD492)",
      }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/events")}
            className="mb-4 text-[#7F4F61] hover:text-[#7F4F61]/80"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Events
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-[#7F4F61] mb-2">
              {isEditing ? "Edit Event" : "Plan New Event"}
            </h1>
            <p className="text-[#7F4F61]">
              Create engaging activities for your residents
            </p>
          </div>
        </div>

        {isLoadingData ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-[#7F4F61]">Loading event data...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chat Section */}
            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-l-[#7F4F61] flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-[#7F4F61]">
                  <div className="flex items-center">
                    <Users className="mr-2 h-5 w-5" />
                    AI Event Planner
                  </div>
                  {isEditing && eventId && (
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-800"
                    >
                      Live Chat
                    </Badge>
                  )}
                  {(!isEditing || !eventId) && (
                    <Badge
                      variant="secondary"
                      className="bg-yellow-100 text-yellow-800"
                    >
                      General Guidance
                    </Badge>
                  )}
                </CardTitle>
                {isEditing && eventId && (
                  <p className="text-xs text-[#7F4F61]/70 mt-1">
                    💡 I can help you manage invitations and find residents by
                    interests (e.g., "find residents who like music"). Just ask!
                  </p>
                )}
                {(!isEditing || !eventId) && (
                  <p className="text-xs text-[#7F4F61]/70 mt-1">
                    💡 Save your event first to unlock personalized resident
                    recommendations and invitation management!
                  </p>
                )}
              </CardHeader>
              <CardContent className="flex flex-col flex-1 p-6 pt-0">
                <ScrollArea className="flex-1 pr-4 mb-4">
                  <div className="space-y-4">
                    {chatMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.sender === "user"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[80%] p-3 rounded-lg ${
                            message.sender === "user"
                              ? "bg-[#C08777] text-white"
                              : "bg-[#AFD0CD]/20 text-[#7F4F61]"
                          }`}
                        >
                          <p className="text-sm">{message.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                <div className="flex space-x-2 mt-auto pt-4 border-t border-[#AFD0CD]/30">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={
                      isEditing && eventId
                        ? "Ask about event planning..."
                        : "Ask for general event planning guidance..."
                    }
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                    className="border-[#C08777]/30 focus:border-[#C08777]"
                  />
                  <Button
                    onClick={sendMessage}
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
                    onChange={(e) =>
                      setEvent((prev) => ({ ...prev, title: e.target.value }))
                    }
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
                    onChange={(e) =>
                      setEvent((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
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
                      onChange={(e) =>
                        setEvent((prev) => ({ ...prev, date: e.target.value }))
                      }
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
                      onChange={(e) =>
                        setEvent((prev) => ({
                          ...prev,
                          duration_minutes: parseInt(e.target.value),
                        }))
                      }
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
                      <p className="text-xs text-[#7F4F61]/70 mb-2">
                        Suggested for this event:
                      </p>
                      <div className="space-y-2">
                        {suggestedResidents.map((residentId) => {
                          const resident = elders.find(
                            (e) => e.id === residentId
                          );
                          if (!resident) return null;
                          return (
                            <div
                              key={resident.id}
                              className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                                event.invitees.includes(resident.id)
                                  ? "border-[#7F4F61] bg-[#AFD0CD]/20"
                                  : "border-[#C08777]/30 hover:border-[#C08777]"
                              }`}
                              onClick={() => toggleInvitee(resident.id)}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium text-[#7F4F61]">
                                    {resident.name}
                                  </p>
                                  {resident.summary && (
                                    <p className="text-xs text-[#7F4F61]/70 mt-1">
                                      {resident.summary.short_summary}
                                    </p>
                                  )}
                                </div>
                                {event.invitees.includes(resident.id) && (
                                  <Badge className="bg-[#C08777] text-white">
                                    Invited
                                  </Badge>
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
                            .filter(
                              (elder) => !event.invitees.includes(elder.id)
                            )
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
                          const resident = elders.find(
                            (e) => e.id === residentId
                          );
                          if (!resident) return null;
                          return (
                            <div
                              key={resident.id}
                              className="p-3 border border-[#7F4F61] rounded-lg bg-[#AFD0CD]/20"
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium text-[#7F4F61]">
                                    {resident.name}
                                  </p>
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
                  disabled={!event.title || !event.date || isSaving}
                  className="w-full bg-[#C08777] hover:bg-[#C08777]/90 text-white"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isSaving
                    ? "Saving..."
                    : isEditing
                    ? "Update Event"
                    : "Save Event"}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventPlanning;
