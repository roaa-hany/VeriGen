
import React from "react";
import { Link } from "react-router-dom";
import { Cpu, Code, FileText, Github, Zap } from "lucide-react";

export const MainHeader = () => {
  return (
    <header className="bg-[#1C2D41] text-white py-4 px-6 shadow-md">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center mb-4 md:mb-0">
          <a 
            href="/" 
            className="flex items-center"
          >
            <Cpu className="h-6 w-6 mr-2 text-[#F6B72E]" />
            <span className="text-xl font-bold">VeriGen</span>
          </a>
        </div>
        
        <nav className="flex items-center space-x-6">
          <a 
            href="#" 
            className="flex items-center text-sm hover:text-[#F6B72E] transition-colors"
          >
            <Code className="h-4 w-4 mr-1" />
            <span>About VeriGen</span>
          </a>
          <Link to="/results" className="flex items-center text-sm hover:text-[#F6B72E] transition-colors">
            <FileText className="h-4 w-4 mr-1" />
            <span>Generated Code</span>
          </Link>
          <a 
            href="https://github.com/roaa-hany/VeriGen" 
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-sm hover:text-[#F6B72E] transition-colors"
          >
            <Github className="h-4 w-4 mr-1" />
            <span>GitHub</span>
          </a>
          <a 
            href="#" 
            className="flex items-center text-sm hover:text-[#F6B72E] transition-colors"
          >
            <Zap className="h-4 w-4 mr-1" />
            <span>Examples</span>
          </a>
        </nav>
      </div>
    </header>
  );
};
