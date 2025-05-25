
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Users, FileText, Calendar, Plus, MessageCircle, Heart } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <Heart className="h-16 w-16 text-blue-600" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to CareEvents
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            An intelligent event planning platform for assisted living homes. 
            Use AI-powered insights from resident conversations and preferences 
            to create meaningful, personalized activities that bring joy and connection.
          </p>
        </div>

        {/* Main Action Buttons */}
        <div className="flex flex-wrap justify-center gap-6 mb-16">
          <Link to="/elders">
            <Button size="lg" className="flex flex-col items-center p-8 h-auto min-w-[160px] bg-blue-600 hover:bg-blue-700 text-white">
              <Users className="h-8 w-8 mb-2" />
              <span className="text-lg font-medium">Add new person</span>
            </Button>
          </Link>

          <Link to="/elders">
            <Button size="lg" className="flex flex-col items-center p-8 h-auto min-w-[160px] bg-green-600 hover:bg-green-700 text-white">
              <FileText className="h-8 w-8 mb-2" />
              <span className="text-lg font-medium">Check registers</span>
            </Button>
          </Link>

          <Link to="/events/new">
            <Button size="lg" className="flex flex-col items-center p-8 h-auto min-w-[160px] bg-purple-600 hover:bg-purple-700 text-white">
              <Plus className="h-8 w-8 mb-2" />
              <span className="text-lg font-medium">Plan activity</span>
            </Button>
          </Link>

          <Link to="/events">
            <Button size="lg" className="flex flex-col items-center p-8 h-auto min-w-[160px] bg-orange-600 hover:bg-orange-700 text-white">
              <Calendar className="h-8 w-8 mb-2" />
              <span className="text-lg font-medium">Check calendar</span>
            </Button>
          </Link>

          <Link to="/elders">
            <Button size="lg" className="flex flex-col items-center p-8 h-auto min-w-[160px] bg-indigo-600 hover:bg-indigo-700 text-white">
              <MessageCircle className="h-8 w-8 mb-2" />
              <span className="text-lg font-medium">Brainstorm and ask questions</span>
            </Button>
          </Link>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 pt-8 border-t border-gray-200">
          <p className="text-gray-500">
            CareEvents - Bringing meaningful connections to assisted living communities
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
