
import React from "react";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

const FeedbackButton: React.FC = () => {
  const handleFeedbackClick = () => {
    window.open("https://your-feedback-form-link", "_blank");
  };
  
  return (
    <div className="fixed bottom-4 right-4 z-40">
      <Button 
        onClick={handleFeedbackClick} 
        className="shadow-lg"
        size="sm"
      >
        <MessageSquare className="mr-2 h-4 w-4" />
        Send Feedback
      </Button>
    </div>
  );
};

export default FeedbackButton;
