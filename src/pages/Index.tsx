

import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Users, FileText, Calendar, Plus, MessageCircle, Heart } from 'lucide-react';

const Index = () => {
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
          <Link to="/elders">
            <Button size="lg" className="flex flex-col items-center p-8 h-auto min-w-[160px] bg-[#7F4F61] hover:bg-[#7F4F61]/90 text-white">
              <Users className="h-8 w-8 mb-2" />
              <span className="text-lg font-medium">Add new person</span>
            </Button>
          </Link>

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
            <Button size="lg" className="flex flex-col items-center p-8 h-auto min-w-[160px] bg-[#AFD0CD] hover:bg-[#AFD0CD]/90 text-[#7F4F61]">
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

