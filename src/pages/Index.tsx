
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Calendar, MessageCircle, Heart, ArrowRight } from 'lucide-react';

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

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-l-blue-500">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-800">
                <Users className="mr-3 h-6 w-6" />
                Elder Profiles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Create detailed profiles with audio recordings, preferences, and AI-generated summaries 
                to understand each resident's unique interests and history.
              </p>
              <Link to="/elders">
                <Button variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                  Manage Elders
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-l-green-500">
            <CardHeader>
              <CardTitle className="flex items-center text-green-800">
                <Calendar className="mr-3 h-6 w-6" />
                Smart Event Planning
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Plan events with AI assistance that suggests activities based on resident preferences 
                and helps you decide who to invite and how to structure each event.
              </p>
              <Link to="/events">
                <Button variant="outline" className="text-green-600 border-green-200 hover:bg-green-50">
                  View Events
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-l-purple-500">
            <CardHeader>
              <CardTitle className="flex items-center text-purple-800">
                <MessageCircle className="mr-3 h-6 w-6" />
                AI Chat Assistant
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Chat with our AI assistant to get personalized activity suggestions for individual 
                residents or guidance on planning group events that everyone will enjoy.
              </p>
              <Link to="/elders">
                <Button variant="outline" className="text-purple-600 border-purple-200 hover:bg-purple-50">
                  Start Chatting
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Getting Started */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Ready to Get Started?</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-blue-100 mb-6 text-lg">
              Begin by adding your first elder profile or browse existing events to see how our platform works.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/elders">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  <Users className="mr-2 h-5 w-5" />
                  Add First Elder
                </Button>
              </Link>
              <Link to="/events">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                  <Calendar className="mr-2 h-5 w-5" />
                  Plan First Event
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

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
