
import React from "react";

interface GametriqLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  animated?: boolean;
}

const GametriqLogo: React.FC<GametriqLogoProps> = ({ 
  size = "md", 
  className = "",
  animated = false
}) => {
  const sizeClasses = {
    sm: "h-8",
    md: "h-12",
    lg: "h-20",
    xl: "h-28",
  };

  const animationClasses = animated 
    ? "animate-fade-in motion-safe:animate-[fade-in_0.6s_ease-out]" 
    : "";

  return (
    <div className={`flex flex-col items-center ${animationClasses} ${className}`}>
      {/* Logo Image with transparent background styling */}
      <div className={`${sizeClasses[size]} aspect-auto flex items-center justify-center mx-auto`}>
        <img 
          src="/lovable-uploads/580daa8d-e5c4-4112-ab12-2d74a54a0915.png" 
          alt="Gametriq Logo" 
          className="h-full w-auto object-contain drop-shadow-md"
        />
      </div>
      
      <h1 className="text-2xl font-bold mt-2 bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text text-transparent">
        GAMETRIQ
      </h1>
      <p className="text-xs text-blue-400 tracking-wider font-medium">TRACK. COMPETE. WIN.</p>
    </div>
  );
};

export default GametriqLogo;
