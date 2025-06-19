
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="bg-slate-800/50 border-slate-700 w-full max-w-md">
        <CardContent className="p-8 text-center">
          <h1 className="text-6xl md:text-7xl font-bold text-blue-400 mb-4">404</h1>
          <h2 className="text-xl md:text-2xl font-semibold text-white mb-2">Page Not Found</h2>
          <p className="text-slate-300 mb-6 text-sm md:text-base">
            The page you're looking for doesn't exist or may have been moved.
          </p>
          <div className="space-y-3">
            <Button 
              onClick={() => navigate('/')} 
              className="bg-blue-600 hover:bg-blue-700 w-full"
            >
              <Home className="mr-2 h-4 w-4" />
              Return to Home
            </Button>
            <Button 
              onClick={() => navigate(-1)} 
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-700 w-full"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
