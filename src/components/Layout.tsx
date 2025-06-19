
import React from "react";
import { Toaster } from "@/components/ui/toaster";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {children}
      <Toaster />
    </div>
  );
};

export default Layout;
