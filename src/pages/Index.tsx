
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Users, FileText, Calendar, Plus, MessageCircle, Heart } from 'lucide-react';

const Index = () => {
  const [isNewElderOpen, setIsNewElderOpen] = useState(false);
  const [newElderName, setNewElderName] = useState('');
  const [newElderDetails, setNewElderDetails] = useState('');
  const [selectedAudioFile, setSelectedAudioFile] = useState<File | null>(null);

  const handleCreateElder = async () => {
    if (!newElderName.trim()) return;

    // In real app, this would make API calls
    console.log('Creating elder:', {
      name: newElderName,
      details: newElderDetails,
      audioFile: selectedAudioFile
    });

    // Reset form and close dialog
    setNewElderName('');
    setNewElderDetails('');
    setSelectedAudioFile(null);
    setIsNewElderOpen(false);
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(to bottom right, #AFD0CD, #EFD492)' }}>
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <Heart className="h-16 w-16 text-[#7F4F61]" />
          </div>
          <h1 className="text-5xl font-bold text-[#7F4F61] mb-6">
            Welcome to ResidentLines
          </h1>
          <p className="text-xl text-[#7F4F61] max-w-3xl mx-auto leading-relaxed">
            Create activities that your residents will thank you for.
          </p>
        </div>

        {/* Main Action Buttons */}
        <div className="flex flex-wrap justify-center gap-6 mb-16">
          <Dialog open={isNewElderOpen} onOpenChange={setIsNewElderOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="flex flex-col items-center p-8 h-auto min-w-[160px] bg-[#7F4F61] hover:bg-[#7F4F61]/90 text-white">
                <Users className="h-8 w-8 mb-2" />
                <span className="text-lg font-medium">Add new person</span>
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

          <Link to="/elders">
            <Button size="lg" className="flex flex-col items-center p-8 h-auto min-w-[160px] bg-[#C08777] hover:bg-[#C08777]/90 text-white">
              <FileText className="h-8 w-8 mb-2" />
              <span className="text-lg font-medium">Check registers</span>
            </Button>
          </Link>

          <Link to="/events/new">
            <Button size="lg" className="flex flex-col items-center p-8 h-auto min-w-[160px] bg-[#7F4F61] hover:bg-[#7F4F61]/90 text-white">
              <Plus className="h-8 w-8 mb-2" />
              <span className="text-lg font-medium">Plan activity</span>
            </Button>
          </Link>

          <Link to="/events">
            <Button size="lg" className="flex flex-col items-center p-8 h-auto min-w-[160px] bg-[#C08777] hover:bg-[#C08777]/90 text-white">
              <Calendar className="h-8 w-8 mb-2" />
              <span className="text-lg font-medium">Check calendar</span>
            </Button>
          </Link>

          <Link to="/elders">
            <Button size="lg" className="flex flex-col items-center p-8 h-auto min-w-[160px] bg-[#8BB8B3] hover:bg-[#8BB8B3]/90 text-[#7F4F61]">
              <MessageCircle className="h-8 w-8 mb-2" />
              <span className="text-lg font-medium">Brainstorm and ask questions</span>
            </Button>
          </Link>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 pt-8 border-t border-[#7F4F61]/20">
          <p className="text-[#7F4F61]">
            ResidentLines - Bringing meaningful connections to assisted living communities
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
