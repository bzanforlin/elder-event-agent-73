import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, ArrowLeft, User } from "lucide-react";
import { elderApi, chatApi, Elder, ChatMessage } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const ElderChat = () => {
  const { elderId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const [elder, setElder] = useState<Elder | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [chatMessages]);

  // Fetch elder data and chat messages
  useEffect(() => {
    const fetchData = async () => {
      if (!elderId) return;

      try {
        setIsInitialLoading(true);

        // Fetch elder details
        const elderData = await elderApi.get(parseInt(elderId));
        setElder(elderData);

        // Fetch existing chat messages
        const messages = await chatApi.getElderMessages(parseInt(elderId));
        setChatMessages(messages);

        // If no messages exist, send an initial greeting
        if (messages.length === 0) {
          const initialMessage = `Hello! I'm here to help you plan activities for ${elderData.name}. I have detailed information about their preferences and background. What would you like to know or plan for them?`;

          await chatApi.sendElderMessage(
            parseInt(elderId),
            initialMessage,
            "llm"
          );

          // Refresh messages to include the initial greeting
          const updatedMessages = await chatApi.getElderMessages(
            parseInt(elderId)
          );
          setChatMessages(updatedMessages);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load elder information. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsInitialLoading(false);
      }
    };

    fetchData();
  }, [elderId, toast]);

  // Poll for new messages (to catch AI responses)
  useEffect(() => {
    if (!elderId || isInitialLoading) return;

    const pollMessages = async () => {
      try {
        const messages = await chatApi.getElderMessages(parseInt(elderId));
        setChatMessages(messages);
      } catch (error) {
        console.error("Error polling messages:", error);
      }
    };

    // Poll every 2 seconds for new messages
    const interval = setInterval(pollMessages, 2000);

    return () => clearInterval(interval);
  }, [elderId, isInitialLoading]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !elderId) return;

    try {
      setIsLoading(true);

      // Send user message
      await chatApi.sendElderMessage(parseInt(elderId), newMessage, "user");

      // Clear input
      setNewMessage("");

      // Refresh messages immediately to show user message
      const updatedMessages = await chatApi.getElderMessages(parseInt(elderId));
      setChatMessages(updatedMessages);

      // Note: AI response will be handled by the polling mechanism
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isInitialLoading) {
    return (
      <div
        className="min-h-screen p-6 flex items-center justify-center"
        style={{
          background: "linear-gradient(to bottom right, #AFD0CD, #EFD492)",
        }}
      >
        <div className="text-[#7F4F61] text-lg">Loading...</div>
      </div>
    );
  }

  if (!elder) {
    return (
      <div
        className="min-h-screen p-6 flex items-center justify-center"
        style={{
          background: "linear-gradient(to bottom right, #AFD0CD, #EFD492)",
        }}
      >
        <div className="text-[#7F4F61] text-lg">Elder not found</div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen p-6"
      style={{
        background: "linear-gradient(to bottom right, #AFD0CD, #EFD492)",
      }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/elders")}
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
                  {elder.summary ? (
                    <div>
                      <p className="text-sm text-[#7F4F61]/70 leading-relaxed">
                        {elder.summary.short_summary}
                      </p>
                    </div>
                  ) : elder.extra_details ? (
                    <div>
                      <p className="text-sm text-[#7F4F61]/70 leading-relaxed">
                        {elder.extra_details}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm text-[#7F4F61]/70 leading-relaxed">
                        No summary available yet. Upload audio files to generate
                        a detailed summary.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Chat Section */}
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-l-[#7F4F61] lg:col-span-2 flex flex-col h-[600px]">
            <CardHeader>
              <CardTitle className="text-[#7F4F61]">
                Ask me what you'd like to know about {elder.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col flex-1 p-6 pt-0 min-h-0">
              <ScrollArea
                ref={scrollAreaRef}
                className="flex-1 pr-4 mb-4 h-full"
              >
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
                        className={`max-w-[85%] p-3 rounded-lg ${
                          message.sender === "user"
                            ? "bg-[#C08777] text-white"
                            : "bg-[#AFD0CD]/20 text-[#7F4F61]"
                        }`}
                      >
                        <p className="text-sm leading-relaxed whitespace-pre-line">
                          {message.message}
                        </p>
                        <p className="text-xs opacity-70 mt-1">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-[#AFD0CD]/20 text-[#7F4F61] p-3 rounded-lg">
                        <p className="text-sm">
                          Thinking about {elder.name}...
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              <div className="flex space-x-2 pt-4 border-t border-[#AFD0CD]/30 flex-shrink-0">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={`Ask about activities for ${elder.name}...`}
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                  className="border-[#C08777]/30 focus:border-[#C08777]"
                  disabled={isLoading}
                />
                <Button
                  onClick={sendMessage}
                  disabled={isLoading || !newMessage.trim()}
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
