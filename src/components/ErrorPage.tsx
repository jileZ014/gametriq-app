
import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from 'lucide-react';

const ErrorPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const errorMsg = searchParams.get('msg');

  const getErrorMessage = (msg: string | null) => {
    switch (msg) {
      case 'missing_token':
        return 'No token was provided. Please log in again.';
      case 'unauthorized':
        return 'Unauthorized access. Please check your email link.';
      default:
        return 'Oops! Something went wrong.';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-900/80 backdrop-blur-md text-white">
        <CardHeader>
          <CardTitle className="text-center text-red-400 flex items-center justify-center gap-2">
            <AlertCircle className="h-5 w-5" />
            🚫 Access Denied
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-300 font-bold">
            {getErrorMessage(errorMsg)}
          </p>
          <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
            <Link to="/">Go Back</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ErrorPage;
