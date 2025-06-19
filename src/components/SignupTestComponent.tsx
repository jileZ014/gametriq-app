
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmailService } from "@/services/EmailService";
import { toast } from "sonner";
import { TestTube, Mail, CheckCircle, XCircle } from "lucide-react";

const SignupTestComponent: React.FC = () => {
  const [testEmail, setTestEmail] = useState("");
  const [isTestingSignup, setIsTestingSignup] = useState(false);
  const [isTestingEmail, setIsTestingEmail] = useState(false);
  const [testResults, setTestResults] = useState<{
    signupFlow?: boolean;
    emailSend?: boolean;
    errors?: string[];
  }>({});

  const testSignupFlow = async () => {
    if (!testEmail) {
      toast.error("Please enter a test email");
      return;
    }

    setIsTestingSignup(true);
    const errors: string[] = [];
    
    try {
      console.log('🧪 Testing signup flow for:', testEmail);
      
      // Test email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(testEmail)) {
        errors.push("Email validation failed");
      }
      
      // Test welcome email sending
      console.log('🧪 Testing welcome email send...');
      const result = await EmailService.sendWelcomeEmail(testEmail, testEmail.split('@')[0]);
      
      if (!result.success) {
        errors.push(`Email send failed: ${result.error}`);
        console.error('🚨 Email send failed:', result.error);
      } else {
        console.log('✅ Email send successful:', result.data);
      }
      
      setTestResults({
        signupFlow: errors.length === 0,
        emailSend: result.success,
        errors
      });
      
      if (errors.length === 0) {
        toast.success("Signup flow test passed! Check the logs for details.");
      } else {
        toast.error(`Signup flow test failed: ${errors.join(', ')}`);
      }
      
    } catch (error) {
      console.error('🚨 Signup flow test error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      errors.push(`Exception: ${errorMessage}`);
      setTestResults({
        signupFlow: false,
        emailSend: false,
        errors
      });
      toast.error(`Test failed: ${errorMessage}`);
    } finally {
      setIsTestingSignup(false);
    }
  };

  const testDirectEmailSend = async () => {
    if (!testEmail) {
      toast.error("Please enter a test email");
      return;
    }

    setIsTestingEmail(true);
    
    try {
      console.log('🧪 Testing direct email send to:', testEmail);
      
      const { supabase } = await import('@/integrations/supabase/client');
      
      const { data, error } = await supabase.functions.invoke("send-email", {
        body: { 
          to: testEmail,
          templateType: "welcome",
          params: {
            recipientName: testEmail.split('@')[0]
          }
        }
      });
      
      if (error) {
        console.error('🚨 Direct email test failed:', error);
        toast.error(`Direct email test failed: ${error.message}`);
      } else {
        console.log('✅ Direct email test successful:', data);
        toast.success("Direct email test passed!");
      }
      
    } catch (error) {
      console.error('🚨 Direct email test error:', error);
      toast.error(`Direct email test error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsTestingEmail(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto mt-8 bg-purple-50 border-purple-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-700">
          <TestTube className="h-5 w-5" />
          Signup Flow Testing
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Test Email</label>
          <Input
            type="email"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            placeholder="test@example.com"
            className="w-full"
          />
        </div>
        
        <div className="space-y-2">
          <Button 
            onClick={testSignupFlow}
            disabled={isTestingSignup}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            {isTestingSignup ? "Testing..." : "Test Full Signup Flow"}
          </Button>
          
          <Button 
            onClick={testDirectEmailSend}
            disabled={isTestingEmail}
            variant="outline"
            className="w-full border-purple-300 text-purple-700 hover:bg-purple-50"
          >
            {isTestingEmail ? "Testing..." : "Test Direct Email Send"}
          </Button>
        </div>
        
        {testResults.signupFlow !== undefined && (
          <div className="mt-4 p-3 bg-white rounded border">
            <h4 className="font-medium text-sm mb-2">Test Results:</h4>
            <div className="space-y-1 text-sm">
              <div className="flex items-center gap-2">
                {testResults.signupFlow ? 
                  <CheckCircle className="h-4 w-4 text-green-500" /> : 
                  <XCircle className="h-4 w-4 text-red-500" />
                }
                <span>Signup Flow: {testResults.signupFlow ? "PASSED" : "FAILED"}</span>
              </div>
              <div className="flex items-center gap-2">
                {testResults.emailSend ? 
                  <CheckCircle className="h-4 w-4 text-green-500" /> : 
                  <XCircle className="h-4 w-4 text-red-500" />
                }
                <span>Email Send: {testResults.emailSend ? "PASSED" : "FAILED"}</span>
              </div>
              {testResults.errors && testResults.errors.length > 0 && (
                <div className="mt-2 text-red-600">
                  <strong>Errors:</strong>
                  <ul className="list-disc list-inside">
                    {testResults.errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
        
        <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
          <strong>Note:</strong> Check browser console and Edge Function logs for detailed information.
        </div>
      </CardContent>
    </Card>
  );
};

export default SignupTestComponent;
