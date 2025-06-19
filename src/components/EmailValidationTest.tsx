
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmailService } from "@/services/EmailService";
import { toast } from "sonner";
import { Mail, CheckCircle, XCircle, TestTube } from "lucide-react";

const EmailValidationTest: React.FC = () => {
  const [testEmail, setTestEmail] = useState("");
  const [isTestingEmail, setIsTestingEmail] = useState(false);
  const [emailResult, setEmailResult] = useState<{
    success?: boolean;
    error?: string;
    details?: any;
  }>({});

  const validateEmailProcess = async () => {
    if (!testEmail) {
      toast.error("Please enter a test email");
      return;
    }

    console.log('🧪 Starting email validation test for:', testEmail);
    setIsTestingEmail(true);
    setEmailResult({});
    
    try {
      // Test the complete email flow
      const result = await EmailService.sendWelcomeEmail(testEmail, testEmail.split('@')[0]);
      
      console.log('🧪 Email validation result:', result);
      
      if (result.success) {
        setEmailResult({ 
          success: true, 
          details: 'data' in result ? result.data : null
        });
        toast.success("Email sent successfully! Check your inbox and the logs.");
      } else {
        setEmailResult({ 
          success: false, 
          error: result.error as string 
        });
        toast.error(`Email failed: ${result.error}`);
      }
      
    } catch (error) {
      console.error('🚨 Email validation error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setEmailResult({ 
        success: false, 
        error: errorMessage 
      });
      toast.error(`Test failed: ${errorMessage}`);
    } finally {
      setIsTestingEmail(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto bg-blue-50 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-700">
          <TestTube className="h-5 w-5" />
          Email Process Validation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Test Email Address</label>
          <Input
            type="email"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            placeholder="your-email@example.com"
            className="w-full"
          />
        </div>
        
        <Button 
          onClick={validateEmailProcess}
          disabled={isTestingEmail}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          {isTestingEmail ? (
            "Testing Email Process..."
          ) : (
            <>
              <Mail className="mr-2 h-4 w-4" />
              Validate Email Process
            </>
          )}
        </Button>
        
        {emailResult.success !== undefined && (
          <div className="mt-4 p-3 bg-white rounded border">
            <div className="flex items-center gap-2 mb-2">
              {emailResult.success ? 
                <CheckCircle className="h-4 w-4 text-green-500" /> : 
                <XCircle className="h-4 w-4 text-red-500" />
              }
              <span className="font-medium">
                Email Process: {emailResult.success ? "PASSED" : "FAILED"}
              </span>
            </div>
            
            {emailResult.error && (
              <div className="text-red-600 text-sm">
                <strong>Error:</strong> {emailResult.error}
              </div>
            )}
            
            {emailResult.success && emailResult.details && (
              <div className="text-green-600 text-sm">
                <strong>Success:</strong> Email sent with ID {emailResult.details.id}
              </div>
            )}
          </div>
        )}
        
        <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
          <strong>This test will:</strong>
          <ul className="list-disc list-inside mt-1">
            <li>Validate email format</li>
            <li>Call EmailService.sendWelcomeEmail()</li>
            <li>Test edge function connectivity</li>
            <li>Verify Resend API integration</li>
            <li>Log detailed results to console</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmailValidationTest;
