
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Elder {
  id: number;
  name: string;
  extra_details: string;
  created_at: string;
  summary?: {
    short_summary: string;
    long_summary: string;
  };
}

const Elders = () => {
  const [elders, setElders] = useState<Elder[]>([]);
  const [isNewElderOpen, setIsNewElderOpen] = useState(false);
  const [newElderName, setNewElderName] = useState('');
  const [newElderDetails, setNewElderDetails] = useState('');
  const [selectedAudioFile, setSelectedAudioFile] = useState<File | null>(null);
  const navigate = useNavigate();

  // Mock data for development
  useEffect(() => {
    const mockElders: Elder[] = [
      {
        id: 1,
        name: "Margaret Thompson",
        extra_details: "Former librarian, loves mystery novels and classical music",
        created_at: "2024-01-15",
        summary: {
          short_summary: "Margaret enjoys quiet activities like reading and listening to classical music. She has mobility limitations but is very social.",
          long_summary: "Margaret Thompson is a retired librarian who spent 40 years working at the local public library. She has a deep love for mystery novels, particularly Agatha Christie, and enjoys classical music, especially Beethoven and Mozart. She has some mobility issues but remains mentally sharp and enjoys social interaction. She often shares stories about her library work and the many people she helped over the years."
        }
      },
      {
        id: 2,
        name: "Robert Chen",
        extra_details: "Retired engineer, enjoys chess and documentaries",
        created_at: "2024-01-20",
        summary: {
          short_summary: "Robert is analytical and enjoys strategic games like chess. He's interested in history and science documentaries.",
          long_summary: "Robert Chen is a retired electrical engineer who worked on early computer systems. He has a methodical mind and enjoys activities that challenge him intellectually, such as chess and puzzles. He's particularly interested in historical documentaries, especially those about World War II and technological innovations. Despite being somewhat reserved, he opens up when discussing topics he's passionate about."
        }
      }
    ];
    setElders(mockElders);
  }, []);

  const handleCreateElder = async () => {
    if (!newElderName.trim()) return;

    // In real app, this would make API calls
    const newElder: Elder = {
      id: Date.now(),
      name: newElderName,
      extra_details: newElderDetails,
      created_at: new Date().toISOString(),
    };

    setElders([...elders, newElder]);
    setNewElderName('');
    setNewElderDetails('');
    setSelectedAudioFile(null);
    setIsNewElderOpen(false);
  };

  const handleChatWithElder = (elderId: number) => {
    navigate(`/elders/${elderId}/chat`);
  };

  return (
    <div className="min-h-screen p-6" style={{ background: 'linear-gradient(to bottom right, #AFD0CD, #EFD492)' }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#7F4F61] mb-2">Elder Profiles</h1>
            <p className="text-[#7F4F61]">Manage elder information and preferences</p>
          </div>
          
          <Dialog open={isNewElderOpen} onOpenChange={setIsNewElderOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#C08777] hover:bg-[#C08777]/90 text-white">
                <Plus className="mr-2 h-4 w-4" />
                Add New Elder
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="text-[#7F4F61]">Add New Elder</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <label className="text-sm font-medium text-[#7F4F61] mb-2 block">
                    Name *
                  </label>
                  <Input
                    value={newElderName}
                    onChange={(e) => setNewElderName(e.target.value)}
                    placeholder="Enter elder's name"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-[#7F4F61] mb-2 block">
                    Additional Details
                  </label>
                  <Textarea
                    value={newElderDetails}
                    onChange={(e) => setNewElderDetails(e.target.value)}
                    placeholder="Any additional information about preferences, background, etc."
                    rows={3}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-[#7F4F61] mb-2 block">
                    Initial Audio Recording (Optional)
                  </label>
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={(e) => setSelectedAudioFile(e.target.files?.[0] || null)}
                    className="w-full p-2 border border-[#C08777]/30 rounded-md"
                  />
                </div>
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setIsNewElderOpen(false)} className="border-[#C08777]/30 text-[#7F4F61]">
                    Cancel
                  </Button>
                  <Button onClick={handleCreateElder} disabled={!newElderName.trim()} className="bg-[#C08777] hover:bg-[#C08777]/90 text-white">
                    Create Elder Profile
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {elders.map((elder) => (
            <Card key={elder.id} className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-l-[#7F4F61]">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-[#7F4F61] flex items-center justify-between">
                  {elder.name}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleChatWithElder(elder.id)}
                    className="text-[#C08777] hover:text-[#7F4F61] hover:bg-[#AFD0CD]/30"
                  >
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {elder.summary && (
                  <div className="mb-4">
                    <p className="text-sm text-[#7F4F61] mb-2 font-medium">Summary:</p>
                    <p className="text-sm text-[#7F4F61]/80 leading-relaxed">
                      {elder.summary.short_summary}
                    </p>
                  </div>
                )}
                
                {elder.extra_details && (
                  <div className="mb-4">
                    <p className="text-sm text-[#7F4F61] mb-1 font-medium">Details:</p>
                    <p className="text-sm text-[#7F4F61]/70">{elder.extra_details}</p>
                  </div>
                )}
                
                <div className="flex justify-between items-center pt-3 border-t border-[#AFD0CD]/30">
                  <span className="text-xs text-[#7F4F61]/60">
                    Added {new Date(elder.created_at).toLocaleDateString()}
                  </span>
                  <Button variant="outline" size="sm" className="text-[#C08777] border-[#C08777]/30 hover:bg-[#C08777]/10">
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Elders;
