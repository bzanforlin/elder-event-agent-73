import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navigation from "./components/Navigation";
import Index from "./pages/Index";
import Elders from "./pages/Elders";
import Events from "./pages/Events";
import EventPlanning from "./pages/EventPlanning";
import ElderChat from "./pages/ElderChat";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route
              path="/dashboard"
              element={
                <>
                  <Navigation />
                  <Index />
                </>
              }
            />
            <Route
              path="/elders"
              element={
                <>
                  <Navigation />
                  <Elders />
                </>
              }
            />
            <Route
              path="/elders/:elderId/chat"
              element={
                <>
                  <Navigation />
                  <ElderChat />
                </>
              }
            />
            <Route
              path="/events"
              element={
                <>
                  <Navigation />
                  <Events />
                </>
              }
            />
            <Route
              path="/events/new"
              element={
                <>
                  <Navigation />
                  <EventPlanning />
                </>
              }
            />
            <Route
              path="/events/:eventId/edit"
              element={
                <>
                  <Navigation />
                  <EventPlanning />
                </>
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
