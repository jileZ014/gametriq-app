
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageCircle, HelpCircle, Bug, Mail } from "lucide-react";
import { Link } from 'react-router-dom';
import GametriqLogo from './GametriqLogo';

const SupportPage: React.FC = () => {
  const handleQuickAction = (action: string) => {
    // This would trigger specific Typebot flows
    console.log(`Starting ${action} flow`);
    // For now, we'll just show a simple message
    alert(`${action} support flow would start here`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <GametriqLogo size="md" animated={true} />
            <Link to="/app">
              <Button 
                variant="outline" 
                size="sm"
                className="border-blue-500 text-blue-400 hover:bg-blue-950"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Support Center</h1>
          <p className="text-xl text-gray-300">
            Get help with Gametriq or chat with our assistant
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card 
            className="bg-gray-900/80 backdrop-blur-md border-gray-700 hover:border-blue-500 transition-all cursor-pointer transform hover:scale-105"
            onClick={() => handleQuickAction('Ask a Question')}
          >
            <CardHeader className="text-center">
              <div className="h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-white">Ask a Question</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-300">
                Get instant answers about your stats, games, or account
              </p>
            </CardContent>
          </Card>

          <Card 
            className="bg-gray-900/80 backdrop-blur-md border-gray-700 hover:border-green-500 transition-all cursor-pointer transform hover:scale-105"
            onClick={() => handleQuickAction('How to Use Gametriq')}
          >
            <CardHeader className="text-center">
              <div className="h-12 w-12 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <HelpCircle className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-white">How to Use Gametriq</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-300">
                Learn how to track stats, view progress, and maximize your experience
              </p>
            </CardContent>
          </Card>

          <Card 
            className="bg-gray-900/80 backdrop-blur-md border-gray-700 hover:border-red-500 transition-all cursor-pointer transform hover:scale-105"
            onClick={() => handleQuickAction('Report a Bug')}
          >
            <CardHeader className="text-center">
              <div className="h-12 w-12 bg-red-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Bug className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-white">Report a Bug</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-300">
                Found an issue? Let us know and we'll fix it quickly
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Typebot Integration */}
        <Card className="bg-gray-900/80 backdrop-blur-md border-gray-700 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-white text-center text-2xl">
              Chat with Our Assistant
            </CardTitle>
            <p className="text-gray-300 text-center">
              Get personalized help with our AI-powered support bot
            </p>
          </CardHeader>
          <CardContent>
            {/* Typebot Placeholder - Replace with actual Typebot embed */}
            <div className="bg-gray-800/60 rounded-lg p-8 text-center min-h-96 flex flex-col items-center justify-center">
              <MessageCircle className="h-16 w-16 text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Typebot Integration</h3>
              <p className="text-gray-400 mb-4">
                The support chat widget will be embedded here
              </p>
              
              {/* Placeholder iframe for Typebot */}
              <div className="w-full h-64 bg-gray-700/50 rounded-lg border-2 border-dashed border-gray-600 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-gray-400 text-sm mb-2">Typebot Embed Placeholder</p>
                  <code className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">
                    &lt;iframe src="typebot-url"&gt;&lt;/iframe&gt;
                  </code>
                </div>
              </div>
              
              {/* Alternative: Script embed placeholder */}
              <div className="mt-4 text-xs text-gray-500">
                <p>Or embed via script:</p>
                <code className="bg-gray-800 px-2 py-1 rounded mt-1 block">
                  &lt;script src="typebot-script.js"&gt;&lt;/script&gt;
                </code>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card className="bg-gray-900/80 backdrop-blur-md border-gray-700 mt-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-center space-x-6 text-gray-400">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span className="text-sm">support@gametriq.com</span>
              </div>
              <div className="text-sm">
                Response within 24 hours
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default SupportPage;
