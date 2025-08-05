import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { InfoIcon, Key, ExternalLink, Lightbulb } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

interface CircuitInputProps {
  circuitDescription: string;
  setCircuitDescription: (description: string) => void;
  selectedAiProvider: string;
  setSelectedAiProvider: (provider: string) => void;
  selectedAiModel: string;
  setSelectedAiModel: (model: string) => void;
  customModelName: string;
  setCustomModelName: (name: string) => void;
}

export const CircuitInput = ({
  circuitDescription,
  setCircuitDescription,
  selectedAiProvider,
  setSelectedAiProvider,
  selectedAiModel,
  setSelectedAiModel,
  customModelName,
  setCustomModelName
}: CircuitInputProps) => {
  const [aiModels, setAiModels] = useState<string[]>([]);
  const [apiKey, setApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);

  // Updated provider models with correct API model names
  const providerModels: Record<string, string[]> = {
    "openai": ["gpt-4o", "gpt-4o-mini", "gpt-4-turbo"],
    "google": ["gemini-2.0-flash", "gemini-2.5-pro-preview-03-25", "gemini-2.0-flash-thinking-exp-01-21","gemma-3-27b-it"],
    "groq": ["llama3-8b-8192", "llama3-70b-8192", "mixtral-8x7b-32768"],
    "openrouter": ["openrouter/optimus-alpha", "meta-llama/llama-4-maverick:free", "deepseek/deepseek-chat-v3-0324:free"]
  };

  // Display friendly names for models
  const modelDisplayNames: Record<string, string> = {
    // OpenAI
    "gpt-4o": "GPT-4o",
    "gpt-4o-mini": "GPT-4o Mini",
    "gpt-4-turbo": "GPT-4 Turbo",
    
    // Google
    "gemini-2.5-pro-preview-03-25": "Gemini 2.5 Pro Preview",
    "gemini-2.0-flash": "Gemini 2.0 Flash",
    "gemini-2.0-flash-thinking-exp-01-21": "Gemini 2.0 Flash Thinking",
    "gemma-3-27b-it": "Gemma 3 (27B)",
    
    // Groq
    "llama3-8b-8192": "Llama 3 (8B) - 8K Context",
    "llama3-70b-8192": "Llama 3 (70B) - 8K Context",
    "mixtral-8x7b-32768": "Mixtral 8x7B - 32K Context",
    
    // OpenRouter
    "openrouter/optimus-alpha": "Optimus Alpha",
    "meta-llama/llama-4-maverick:free": "Llama 4 Maverick",
    "deepseek/deepseek-chat-v3-0324:free": "DeepSeek Chat v3"
  };

  const providerLinks = {
    openai: "https://platform.openai.com/api-keys",
    google: "https://aistudio.google.com/app/apikey",
    groq: "https://console.groq.com/keys",
    openrouter: "https://openrouter.ai/settings/keys"
  };

  const exampleCircuits = [
    "4-to-1 multiplexer using case statement",
    "8-bit ripple carry adder",
    "D flip-flop with asynchronous reset",
    "3-to-8 decoder with enable",
    "4-bit counter with load and reset",
    "Simple ALU with 4 operations",
    "Shift register (SISO, SIPO, PISO, PIPO)",
    "Traffic light controller FSM"
  ];

  useEffect(() => {
    if (selectedAiProvider) {
      setAiModels(providerModels[selectedAiProvider] || []);
      if (providerModels[selectedAiProvider]?.length > 0) {
        setSelectedAiModel(providerModels[selectedAiProvider][0]);
      }
      const savedApiKey = localStorage.getItem(`apiKey_${selectedAiProvider}`);
      if (savedApiKey) {
        setApiKey(savedApiKey);
      } else {
        setApiKey("");
      }
    }
  }, [selectedAiProvider, setSelectedAiModel]);

  const handleApiKeySave = () => {
    if (apiKey.trim()) {
      localStorage.setItem(`apiKey_${selectedAiProvider}`, apiKey);
      toast.success(`API key saved for ${selectedAiProvider}`);
      setShowApiKey(false);
    } else {
      toast.error("Please enter a valid API key");
    }
  };

  const hasApiKey = (provider: string) => {
    return !!localStorage.getItem(`apiKey_${provider}`);
  };

  const handleExampleClick = (example: string) => {
    setCircuitDescription(example);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label htmlFor="circuit-description" className="text-base font-medium">
            Circuit Description
          </Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <InfoIcon className="h-4 w-4 text-slate-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">Describe the digital circuit you want to generate. Be specific about functionality, inputs, outputs, and any special requirements.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Textarea
          id="circuit-description"
          placeholder="e.g., 4-to-1 multiplexer using case statement with 2-bit select input, 4 data inputs, and 1 output"
          value={circuitDescription}
          onChange={(e) => setCircuitDescription(e.target.value)}
          className="min-h-32"
        />
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-amber-500" />
            <Label className="text-sm font-medium text-slate-700">Example Circuits</Label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {exampleCircuits.map((example, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleExampleClick(example)}
                className="text-left justify-start h-auto py-2 px-3 text-xs"
              >
                {example}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label htmlFor="ai-provider" className="text-base font-medium">
            AI Provider
          </Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <InfoIcon className="h-4 w-4 text-slate-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">Select which AI provider to use for generating Verilog code.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Select value={selectedAiProvider} onValueChange={setSelectedAiProvider}>
          <SelectTrigger>
            <SelectValue placeholder="Select AI Provider" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="google">Google</SelectItem>
            <SelectItem value="openai">OpenAI</SelectItem>
            <SelectItem value="groq">Groq</SelectItem>
            <SelectItem value="openrouter">OpenRouter</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {selectedAiProvider && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label htmlFor="ai-model" className="text-base font-medium">
              AI Model
            </Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <InfoIcon className="h-4 w-4 text-slate-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">Select which model to use from the chosen provider.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="space-y-2">
            <Select value={selectedAiModel} onValueChange={setSelectedAiModel}>
              <SelectTrigger>
                <SelectValue placeholder="Select AI Model" />
              </SelectTrigger>
              <SelectContent>
                {aiModels.map((model) => (
                  <SelectItem key={model} value={model}>
                    {modelDisplayNames[model] || model}
                  </SelectItem>
                ))}
                <SelectItem value="custom">Custom Model Name</SelectItem>
              </SelectContent>
            </Select>
            
            {selectedAiModel === "custom" && (
              <div className="space-y-2">
                <Label htmlFor="custom-model">Custom Model Name</Label>
                <Input
                  id="custom-model"
                  placeholder="Enter exact model name (e.g., gpt-4-turbo-preview, claude-3-opus-20240229)"
                  value={customModelName}
                  onChange={(e) => setCustomModelName(e.target.value)}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-slate-500">
                  Enter the exact model name as required by your AI provider's API
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {selectedAiProvider && (
        <div className="space-y-2">
          <div className="flex justify-between items-center mb-1">
            <Label htmlFor="api-key" className="text-base font-medium">
              API Key for {selectedAiProvider}
            </Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <InfoIcon className="h-4 w-4 text-slate-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">Your API key will be stored locally on your device and never sent to our servers.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <a 
            href={providerLinks[selectedAiProvider as keyof typeof providerLinks]} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 mb-2"
          >
            <ExternalLink className="h-4 w-4" />
            Get API key for {selectedAiProvider}
          </a>
          
          {showApiKey ? (
            <div className="space-y-2">
              <Input
                id="api-key"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={`Enter your ${selectedAiProvider} API key`}
                className="font-mono"
              />
              <div className="flex gap-2 mt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowApiKey(false)}
                  className="w-1/2"
                >
                  Cancel
                </Button>
                <Button 
                  size="sm" 
                  onClick={handleApiKeySave}
                  className="w-1/2"
                >
                  Save API Key
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Button 
                variant={hasApiKey(selectedAiProvider) ? "outline" : "default"}
                size="sm" 
                onClick={() => setShowApiKey(true)}
                className="flex items-center gap-1 w-full"
              >
                <Key className="h-4 w-4" />
                {hasApiKey(selectedAiProvider) ? "Update API Key" : "Set API Key"}
              </Button>
              
              {hasApiKey(selectedAiProvider) && (
                <p className="text-sm text-green-600">API key for {selectedAiProvider} is set and stored locally</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
