import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface VerilogPreferencesProps {
  selectedModuleFeatures: string[];
  setSelectedModuleFeatures: (features: string[]) => void;
  selectedTestbenchFeatures: string[];
  setSelectedTestbenchFeatures: (features: string[]) => void;
  codingStyle: "structural" | "behavioral" | "mixed";
  setCodingStyle: (style: "structural" | "behavioral" | "mixed") => void;
  testbenchType: "basic" | "comprehensive" | "self_checking";
  setTestbenchType: (type: "basic" | "comprehensive" | "self_checking") => void;
  additionalRequirements: string;
  setAdditionalRequirements: (requirements: string) => void;
}

export const VerilogPreferences = ({
  selectedModuleFeatures,
  setSelectedModuleFeatures,
  selectedTestbenchFeatures,
  setSelectedTestbenchFeatures,
  codingStyle,
  setCodingStyle,
  testbenchType,
  setTestbenchType,
  additionalRequirements,
  setAdditionalRequirements
}: VerilogPreferencesProps) => {
  const handleModuleFeatureChange = (featureId: string, checked: boolean) => {
    if (checked) {
      setSelectedModuleFeatures([...selectedModuleFeatures, featureId]);
    } else {
      setSelectedModuleFeatures(selectedModuleFeatures.filter(id => id !== featureId));
    }
  };

  const handleTestbenchFeatureChange = (featureId: string, checked: boolean) => {
    if (checked) {
      setSelectedTestbenchFeatures([...selectedTestbenchFeatures, featureId]);
    } else {
      setSelectedTestbenchFeatures(selectedTestbenchFeatures.filter(id => id !== featureId));
    }
  };

  const moduleFeatures = [
    { id: "comments", label: "Detailed Comments", description: "Add comprehensive comments explaining the logic" },
    { id: "parameters", label: "Parameterized Design", description: "Use parameters for configurable widths and values" },
    { id: "reset", label: "Reset Logic", description: "Include reset functionality where appropriate" },
    { id: "clock_enable", label: "Clock Enable", description: "Add clock enable signals for sequential circuits" },
    { id: "error_handling", label: "Error Handling", description: "Include basic error detection and handling" },
    { id: "synthesis_directives", label: "Synthesis Directives", description: "Add synthesis-friendly coding practices" }
  ];

  const testbenchFeatures = [
    { id: "clock_generation", label: "Clock Generation", description: "Generate clock signals for sequential circuits" },
    { id: "reset_sequence", label: "Reset Sequence", description: "Include proper reset initialization" },
    { id: "test_vectors", label: "Comprehensive Test Vectors", description: "Test all possible input combinations" },
    { id: "edge_cases", label: "Edge Case Testing", description: "Test boundary conditions and edge cases" },
    { id: "timing_checks", label: "Timing Verification", description: "Verify setup and hold times" },
    { id: "coverage_analysis", label: "Coverage Analysis", description: "Include coverage collection statements" },
    { id: "waveform_dump", label: "Waveform Dump", description: "Generate VCD files for waveform viewing" },
    { id: "assertions", label: "SystemVerilog Assertions", description: "Add SVA assertions for verification" }
  ];

  return (
    <>
      <TabsContent value="module" className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-base font-medium">Coding Style</Label>
            <Select value={codingStyle} onValueChange={(value) => setCodingStyle(value as "structural" | "behavioral" | "mixed")}>
              <SelectTrigger>
                <SelectValue placeholder="Select coding style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="behavioral">Behavioral (always blocks, if-else)</SelectItem>
                <SelectItem value="structural">Structural (gate-level instantiation)</SelectItem>
                <SelectItem value="mixed">Mixed (behavioral + structural)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label className="text-base font-medium">Module Features</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {moduleFeatures.map((feature) => (
                <div key={feature.id} className="flex items-start space-x-3 p-3 rounded-md hover:bg-slate-50">
                  <Checkbox 
                    id={`module-${feature.id}`}
                    checked={selectedModuleFeatures.includes(feature.id)}
                    onCheckedChange={(checked) => handleModuleFeatureChange(feature.id, checked as boolean)}
                  />
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Label 
                        htmlFor={`module-${feature.id}`} 
                        className="font-medium cursor-pointer"
                      >
                        {feature.label}
                      </Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <InfoIcon className="h-4 w-4 text-slate-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">{feature.description}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <p className="text-sm text-slate-500">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="testbench" className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-base font-medium">Testbench Type</Label>
            <Select value={testbenchType} onValueChange={(value) => setTestbenchType(value as "basic" | "comprehensive" | "self_checking")}>
              <SelectTrigger>
                <SelectValue placeholder="Select testbench type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basic">Basic (simple stimulus)</SelectItem>
                <SelectItem value="comprehensive">Comprehensive (all test cases)</SelectItem>
                <SelectItem value="self_checking">Self-Checking (automated verification)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label className="text-base font-medium">Testbench Features</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {testbenchFeatures.map((feature) => (
                <div key={feature.id} className="flex items-start space-x-3 p-3 rounded-md hover:bg-slate-50">
                  <Checkbox 
                    id={`testbench-${feature.id}`}
                    checked={selectedTestbenchFeatures.includes(feature.id)}
                    onCheckedChange={(checked) => handleTestbenchFeatureChange(feature.id, checked as boolean)}
                  />
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Label 
                        htmlFor={`testbench-${feature.id}`} 
                        className="font-medium cursor-pointer"
                      >
                        {feature.label}
                      </Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <InfoIcon className="h-4 w-4 text-slate-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">{feature.description}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <p className="text-sm text-slate-500">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="additional" className="space-y-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label htmlFor="additional-requirements" className="text-base font-medium">
              Additional Requirements
            </Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <InfoIcon className="h-4 w-4 text-slate-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">Specify any additional requirements, constraints, or special features for your Verilog code.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Textarea
            id="additional-requirements"
            placeholder="e.g., Use specific naming conventions, target specific FPGA family, include specific timing constraints, etc."
            value={additionalRequirements}
            onChange={(e) => setAdditionalRequirements(e.target.value)}
            className="min-h-24"
          />
        </div>
      </TabsContent>
    </>
  );
};
