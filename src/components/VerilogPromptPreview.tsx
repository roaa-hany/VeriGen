import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface VerilogPromptPreviewProps {
  circuitDescription: string;
  selectedModuleFeatures: string[];
  selectedTestbenchFeatures: string[];
  codingStyle: "structural" | "behavioral" | "mixed";
  testbenchType: "basic" | "comprehensive" | "self_checking";
  additionalRequirements: string;
}

export const VerilogPromptPreview = ({
  circuitDescription,
  selectedModuleFeatures,
  selectedTestbenchFeatures,
  codingStyle,
  testbenchType,
  additionalRequirements
}: VerilogPromptPreviewProps) => {
  const moduleFeatureNames: Record<string, string> = {
    comments: "Detailed Comments",
    parameters: "Parameterized Design",
    reset: "Reset Logic",
    clock_enable: "Clock Enable",
    error_handling: "Error Handling",
    synthesis_directives: "Synthesis Directives"
  };

  const testbenchFeatureNames: Record<string, string> = {
    clock_generation: "Clock Generation",
    reset_sequence: "Reset Sequence",
    test_vectors: "Comprehensive Test Vectors",
    edge_cases: "Edge Case Testing",
    timing_checks: "Timing Verification",
    coverage_analysis: "Coverage Analysis",
    waveform_dump: "Waveform Dump",
    assertions: "SystemVerilog Assertions"
  };

  const generatePrompt = () => {
    const selectedModuleFeatureNames = selectedModuleFeatures.map(id => moduleFeatureNames[id] || id);
    const selectedTestbenchFeatureNames = selectedTestbenchFeatures.map(id => testbenchFeatureNames[id] || id);

    const codingStyleText = {
      behavioral: "Use behavioral modeling with always blocks, if-else statements, and case statements",
      structural: "Use structural modeling with gate-level instantiation and module connections",
      mixed: "Use a combination of behavioral and structural modeling as appropriate"
    }[codingStyle];

    const testbenchTypeText = {
      basic: "Create a basic testbench with simple stimulus patterns",
      comprehensive: "Create a comprehensive testbench that tests all possible input combinations",
      self_checking: "Create a self-checking testbench with automated verification and assertions"
    }[testbenchType];

    return `
You are an expert Verilog/SystemVerilog designer. Generate complete, synthesizable Verilog code for the following digital circuit:

Circuit Description:
${circuitDescription || "No circuit description provided."}

Coding Style Requirements:
${codingStyleText}

Module Requirements:
${selectedModuleFeatureNames.length > 0 
  ? selectedModuleFeatureNames.map(name => `- ${name}`).join('\n') 
  : "- Use standard Verilog coding practices"}

Testbench Requirements:
${testbenchTypeText}
${selectedTestbenchFeatureNames.length > 0 
  ? selectedTestbenchFeatureNames.map(name => `- ${name}`).join('\n') 
  : ""}

${additionalRequirements ? `Additional Requirements:\n${additionalRequirements}` : ""}

Please provide:
1. A complete Verilog module file (module.v) with proper port declarations, internal logic, and comments
2. A complete testbench file (testbench.v) that thoroughly tests the module functionality
3. Ensure the code follows best practices for synthesis and simulation
4. Include appropriate timing constraints and signal declarations
5. Make sure the testbench includes proper stimulus generation and result checking

Format the output with clear separation between the module and testbench code.
`.trim();
  };

  const promptText = generatePrompt();

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">Circuit: {circuitDescription ? "Specified" : "Not specified"}</Badge>
            <Badge variant="outline">Style: {codingStyle}</Badge>
            <Badge variant="outline">Testbench: {testbenchType}</Badge>
            {selectedModuleFeatures.length > 0 && (
              <Badge variant="secondary">{selectedModuleFeatures.length} Module Features</Badge>
            )}
            {selectedTestbenchFeatures.length > 0 && (
              <Badge variant="secondary">{selectedTestbenchFeatures.length} Testbench Features</Badge>
            )}
          </div>
          
          <div className="bg-slate-50 rounded-md p-3 max-h-64 overflow-y-auto">
            <pre className="text-xs text-slate-700 whitespace-pre-wrap font-mono">
              {promptText}
            </pre>
          </div>
          
          <div className="text-xs text-slate-500">
            This prompt will be sent to the AI to generate your Verilog module and testbench files.
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
