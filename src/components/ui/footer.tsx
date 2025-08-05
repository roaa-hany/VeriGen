import React from "react";
import { Github, Mail } from "lucide-react";

export const MainFooter = () => {
  return (
    <footer className="bg-[#1C2D41] text-white py-6 px-6">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-3">VeriGen</h3>
            <p className="text-sm text-gray-300">
              Generate complete Verilog modules and testbenches from natural language descriptions using AI. Making digital design faster and more accessible.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-3">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://github.com/roaa-hany/VeriGen" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-gray-300 hover:text-[#F6B72E] transition-colors"
                >
                  About VeriGen
                </a>
              </li>
              <li>
                <a 
                  href="https://github.com/roaa-hany/VeriGen#getting-started" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-gray-300 hover:text-[#F6B72E] transition-colors"
                >
                  Getting Started
                </a>
              </li>
              <li>
                <a 
                  href="https://github.com/roaa-hany/VeriGen#example-circuits" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-gray-300 hover:text-[#F6B72E] transition-colors"
                >
                  Example Circuits
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-3">Connect</h3>
            <div className="flex space-x-4">
              <a 
                href="https://github.com/roaa-hany/VeriGen" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-[#F6B72E] transition-colors"
              >
                <Github className="h-5 w-5" />
              </a>
              <a 
                href="mailto:roaa.hany@example.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-[#F6B72E] transition-colors"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
            <p className="text-xs text-gray-400 mt-4">
              © {new Date().getFullYear()} VeriGen. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
