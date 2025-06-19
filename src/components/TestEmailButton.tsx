
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Mail, Send } from "lucide-react";
import { withErrorHandling } from "@/utils/errorHandling";

const TestEmailButton = () => {
  const [isSending, setIsSending] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const { toast } = useToast();
  
  const handleSendTestEmail = async () => {
    setIsSending(true);
    setResponse(null);
    
    try {
      await withErrorHandling(async () => {
        console.log("Attempting to send test email...");
        
        // Call the edge function with specified parameters
        const { data, error } = await supabase.functions.invoke("test-email", {
          body: { 
            from: "noreply@gametriq.com",
            to: "jilez60202@gmail.com",
            subject: "Gametriq Email Delivery Test (Production)",
            html: `
              <p>This is a live test email sent from Supabase using Resend with a verified domain.</p>
              <p>Test timestamp: ${new Date().toISOString()}</p>
            `
          }
        });
        
        console.log("Email function response:", data);
        setResponse(data);
        
        if (error) throw error;
        
        console.log("Email sent successfully:", data);
        toast({
          title: "Success",
          description: "Test email sent successfully!",
        });
        
        return data;
      }, { message: "Failed to send test email" });
    } catch (error) {
      console.error("Exception sending test email:", error);
      // Error already handled by withErrorHandling
    } finally {
      setIsSending(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600 mb-3">
        Click the button below to send a test email to jilez60202@gmail.com
      </div>
      
      <Button 
        onClick={handleSendTestEmail} 
        disabled={isSending}
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-6 rounded-md transition-all"
      >
        {isSending ? (
          <div className="flex items-center justify-center gap-2">
            <span className="animate-pulse">Sending...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <Send className="h-5 w-5" />
            <span>Send Test Email</span>
          </div>
        )}
      </Button>
      
      {response && (
        <div className="mt-4 p-4 bg-gray-100 rounded-md overflow-auto max-h-60 border border-gray-200">
          <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email Response:
          </h3>
          <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default TestEmailButton;
