import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { login } from "@/lib/auth";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        title: "Missing information",
        description: "Please provide both email and password.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await login({ email, password });

      // Check for successful login or if already logged in
      // Status 200: Successful login
      // Status 409: Already logged in
      if (response && (response.status === 200 || response.status === 409)) {
        if (response.status === 409) {
          toast({
            title: "Already logged in",
            description: "You are already logged in. Redirecting to dashboard.",
          });
        } else {
          toast({
            title: "Success",
            description: "You have been logged in successfully.",
          });
        }
        navigate("/dashboard");
      } else {
        // Use error message from API if available, otherwise a generic one.
        const errorMessage =
          response?.data?.detail ||
          response?.detail ||
          "Invalid email or password. Please try again.";
        toast({
          title: "Login failed",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Error",
        description:
          "An unexpected error occurred while trying to log in. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen p-6"
      style={{
        background: "linear-gradient(to bottom right, #AFD0CD, #EFD492)",
      }}
    >
      <div className="max-w-md mx-auto mt-20">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <Heart className="h-16 w-16 text-[#7F4F61]" />
          </div>
          <h1 className="text-3xl font-bold text-[#7F4F61] mb-2">
            Welcome to Gertrude
          </h1>
          <p className="text-[#7F4F61]">
            Sign in to manage your assisted living community
          </p>
        </div>

        <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-l-[#7F4F61]">
          <CardContent className="pt-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#7F4F61]">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="border-[#C08777]/30 focus:border-[#C08777]"
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-[#7F4F61]">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="border-[#C08777]/30 focus:border-[#C08777]"
                  disabled={isLoading}
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#C08777] hover:bg-[#C08777]/90 text-white"
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
