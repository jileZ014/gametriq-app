
import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowRight, BarChart3, TrendingUp, Users, CheckCircle, Star, Play, Trophy, Target, Zap } from "lucide-react";
import { Link } from 'react-router-dom';
import GametriqLogo from './GametriqLogo';
import AuthBackground from './AuthBackground';

const LandingPage = () => {
  useEffect(() => {
    // Check if user already has a token and redirect to /app
    const storedToken = localStorage.getItem('gametriq_token');
    if (storedToken) {
      window.location.href = '/app';
    }
  }, []);

  return (
    <>
      <AuthBackground />
      <div className="relative min-h-screen">
        {/* Navigation Header */}
        <nav className="relative z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <GametriqLogo size="md" animated={true} />
              <div className="flex items-center gap-4">
                <Link to="/login">
                  <Button variant="outline" className="border-blue-400 text-blue-400 hover:bg-blue-950">
                    Sign In
                  </Button>
                </Link>
                <Link to="/login">
                  <Button className="bg-green-600 hover:bg-green-700">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </nav>
        
        {/* Hero Section */}
        <section className="relative z-10 container mx-auto px-4 py-20 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-green-400 to-blue-500 bg-clip-text text-transparent">
              GAMETRIQ
            </h1>
            <p className="text-xl md:text-2xl mb-4 text-blue-400 font-semibold tracking-wider">
              TRACK. COMPETE. WIN.
            </p>
            <p className="text-lg md:text-xl mb-8 text-gray-300 max-w-2xl mx-auto">
              The ultimate basketball stat tracking platform for coaches and parents. 
              Track live stats, analyze performance, and celebrate every milestone.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link to="/login">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg font-semibold rounded-full transform hover:scale-105 transition-all">
                  Start Tracking Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="lg" variant="outline" className="border-blue-400 text-blue-400 hover:bg-blue-950 px-8 py-6 text-lg font-semibold rounded-full">
                    <Play className="mr-2 h-5 w-5" />
                    Watch Demo
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-2xl bg-gray-900 border-gray-700">
                  <DialogHeader>
                    <DialogTitle className="text-white text-center text-2xl">Gametriq in Action</DialogTitle>
                    <DialogDescription className="text-gray-300 text-center">
                      See how easy it is to track basketball stats in real-time
                    </DialogDescription>
                  </DialogHeader>
                  <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Play className="h-16 w-16 text-blue-400 mx-auto mb-4" />
                      <p className="text-gray-400">Demo video coming soon!</p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Social Proof */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-gray-400 text-sm">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>Trusted by 500+ coaches</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                <span>10,000+ games tracked</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-400" />
                <span>4.9/5 rating</span>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="relative z-10 container mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Everything You Need</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Comprehensive basketball analytics designed for modern teams
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="bg-gray-900/60 backdrop-blur-md border-gray-700 hover:border-blue-500 transition-all transform hover:scale-105">
              <CardHeader>
                <div className="h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-white">Live Stat Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Track shots, assists, rebounds, and more in real-time during games. 
                  Instant feedback and live updates.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/60 backdrop-blur-md border-gray-700 hover:border-green-500 transition-all transform hover:scale-105">
              <CardHeader>
                <div className="h-12 w-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-white">Advanced Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Deep insights into player performance with charts, trends, 
                  and comparative analysis.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/60 backdrop-blur-md border-gray-700 hover:border-purple-500 transition-all transform hover:scale-105">
              <CardHeader>
                <div className="h-12 w-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-white">Team Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Manage rosters, track individual player development, 
                  and organize your entire program.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/60 backdrop-blur-md border-gray-700 hover:border-yellow-500 transition-all transform hover:scale-105">
              <CardHeader>
                <div className="h-12 w-12 bg-yellow-600 rounded-lg flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-white">Performance Goals</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Set targets, track progress, and celebrate achievements 
                  to keep players motivated.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/60 backdrop-blur-md border-gray-700 hover:border-red-500 transition-all transform hover:scale-105">
              <CardHeader>
                <div className="h-12 w-12 bg-red-600 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-white">Season Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Monitor season-long trends, compare game performances, 
                  and identify improvement areas.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/60 backdrop-blur-md border-gray-700 hover:border-blue-500 transition-all transform hover:scale-105">
              <CardHeader>
                <div className="h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-white">Easy Setup</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Get started in minutes with our intuitive interface. 
                  No complex setup or training required.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative z-10 container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Transform Your Team?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join hundreds of coaches and thousands of players who are already using Gametriq 
              to track their basketball journey.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg font-semibold rounded-full">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="border-blue-400 text-blue-400 hover:bg-blue-950 px-8 py-6 text-lg font-semibold rounded-full">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative z-10 border-t border-gray-800 bg-gray-900/80 backdrop-blur-md">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center gap-4 mb-4 md:mb-0">
                <GametriqLogo size="sm" />
                <span className="text-gray-400">© 2024 Gametriq. All rights reserved.</span>
              </div>
              <div className="flex items-center gap-6 text-gray-400">
                <a href="#" className="hover:text-white transition-colors">Privacy</a>
                <a href="#" className="hover:text-white transition-colors">Terms</a>
                <a href="#" className="hover:text-white transition-colors">Contact</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default LandingPage;
