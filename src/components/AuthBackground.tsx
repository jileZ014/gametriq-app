
import React from "react";

const AuthBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden -z-10">
      {/* Background image with sports theme */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/login-bg.jpg')",
          backgroundPosition: "center",
        }}
      >
        {/* Enhanced dark overlay with better opacity for readability */}
        <div className="absolute inset-0 bg-black/85"></div>
      </div>

      {/* Subtle court pattern overlay for depth */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMCwwIEwxMDAsMCBMMTAwLDEwMCBMMCwxMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PHBhdGggZD0iTTI1LDAgTDI1LDEwMCIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz48cGF0aCBkPSJNNTAsMCBMNTAsMTAwIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiIHN0cm9rZS13aWR0aD0iMSIvPjxwYXRoIGQ9Ik03NSwwIEw3NSwxMDAiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iMjUiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9zdmc+')] opacity-20 bg-[length:100px_100px]"></div>

      {/* Accent elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-400"></div>
      
      {/* Enhanced animated light effects */}
      <div className="absolute top-[15%] left-[10%] w-64 h-64 rounded-full bg-blue-500 opacity-15 blur-[100px] animate-pulse-subtle"></div>
      <div className="absolute bottom-[20%] right-[5%] w-96 h-96 rounded-full bg-blue-400 opacity-15 blur-[120px] animate-pulse-subtle"></div>
    </div>
  );
};

export default AuthBackground;
