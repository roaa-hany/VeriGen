import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { CircuitInput } from "@/components/CircuitInput";
import { VerilogPreferences } from "@/components/VerilogPreferences";
import { VerilogPromptPreview } from "@/components/VerilogPromptPreview";
import { Header } from "@/components/Header";
import { CardSection } from "@/components/CardSection";
import { SubmitButton } from "@/components/SubmitButton";
import { VerilogResult } from "@/types/verilog";

const Index = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [circuitDescription, setCircuitDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const [selectedAiProvider, setSelectedAiProvider] = useState<string>("google");
  const [selectedAiModel, setSelectedAiModel] = useState<string>("");
  const [customModelName, setCustomModelName] = useState<string>("");

  const [selectedModuleFeatures, setSelectedModuleFeatures] = useState<string[]>([
    "comments",
    "parameters"
  ]);
  
  const [selectedTestbenchFeatures, setSelectedTestbenchFeatures] = useState<string[]>([
    "clock_generation",
    "test_vectors",
    "waveform_dump"
  ]);
  
  const [codingStyle, setCodingStyle] = useState<"structural" | "behavioral" | "mixed">("behavioral");
  const [testbenchType, setTestbenchType] = useState<"basic" | "comprehensive" | "self_checking">("comprehensive");
  const [additionalRequirements, setAdditionalRequirements] = useState("");

  useEffect(() => {
    const loadSavedFormData = () => {
      try {
        const savedFormData = sessionStorage.getItem('verilogFormData');
        if (savedFormData) {
          const formData = JSON.parse(savedFormData);
          
          if (formData.circuitDescription) setCircuitDescription(formData.circuitDescription);
          if (formData.selectedAiProvider) setSelectedAiProvider(formData.selectedAiProvider);
          if (formData.selectedAiModel) setSelectedAiModel(formData.selectedAiModel);
          if (formData.customModelName) setCustomModelName(formData.customModelName);
          if (formData.selectedModuleFeatures) setSelectedModuleFeatures(formData.selectedModuleFeatures);
          if (formData.selectedTestbenchFeatures) setSelectedTestbenchFeatures(formData.selectedTestbenchFeatures);
          if (formData.codingStyle) setCodingStyle(formData.codingStyle);
          if (formData.testbenchType) setTestbenchType(formData.testbenchType);
          if (formData.additionalRequirements) setAdditionalRequirements(formData.additionalRequirements);
        }
      } catch (error) {
        console.error("Error loading saved form data:", error);
      }
    };

    loadSavedFormData();
  }, []);

  useEffect(() => {
    const saveFormData = () => {
      try {
        const formData = {
          circuitDescription,
          selectedAiProvider,
          selectedAiModel,
          customModelName,
          selectedModuleFeatures,
          selectedTestbenchFeatures,
          codingStyle,
          testbenchType,
          additionalRequirements
        };
        
        sessionStorage.setItem('verilogFormData', JSON.stringify(formData));
      } catch (error) {
        console.error("Error saving form data:", error);
      }
    };

    saveFormData();
  }, [
    circuitDescription,
    selectedAiProvider,
    selectedAiModel,
    customModelName,
    selectedModuleFeatures,
    selectedTestbenchFeatures,
    codingStyle,
    testbenchType,
    additionalRequirements
  ]);

  const handleSubmit = async () => {
    try {
      if (!circuitDescription.trim()) {
        toast.error("Please provide a circuit description");
        return;
      }
      
      if (!selectedAiProvider || !selectedAiModel) {
        toast.error("Please select both an AI provider and model");
        return;
      }
      
      const apiKey = localStorage.getItem(`apiKey_${selectedAiProvider}`);
      if (!apiKey) {
        toast.error(`Please set an API key for ${selectedAiProvider}`);
        return;
      }
      
      setIsLoading(true);
      
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
      
      const promptText = `
You are an expert Verilog/SystemVerilog designer. Generate complete, synthesizable Verilog code for the following digital circuit:

Circuit Description:
${circuitDescription}

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

IMPORTANT: Format your response as follows:
MODULE_CODE_START
[Complete module.v code here]
MODULE_CODE_END

TESTBENCH_CODE_START
[Complete testbench.v code here]
TESTBENCH_CODE_END
`.trim();
      
      // Use custom model name if "custom" is selected
      const modelToUse = selectedAiModel === "custom" ? customModelName : selectedAiModel;
      
      if (selectedAiModel === "custom" && !customModelName.trim()) {
        toast.error("Please enter a custom model name");
        return;
      }
      
      const payload = {
        github_url: "NULL",
        zip_file: "NULL",
        llm_provider: selectedAiProvider,
        llm_model: modelToUse,
        api_key: apiKey,
        prompt: promptText
      };
      
      // Debug logging
      console.log("Sending payload to API:", {
        ...payload,
        api_key: "[REDACTED]" // Don't log the actual API key
      });
      
      // For Groq, let's try direct API call to test
      if (selectedAiProvider === "groq") {
        console.log("Attempting direct Groq API call for testing...");
        
        const groqPayload = {
          messages: [
            {
              role: "user",
              content: promptText
            }
          ],
          model: modelToUse,
          temperature: 0.1,
          max_tokens: 4000
        };
        
        console.log("Direct Groq payload:", groqPayload);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 60000);
        
        try {
          const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify(groqPayload),
            signal: controller.signal
          });
          
          clearTimeout(timeoutId);
          
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error("Direct Groq API Error:", errorData);
            throw new Error(`Groq API Error (${response.status}): ${errorData.error?.message || 'Unknown error'}`);
          }
          
          const result = await response.json();
          console.log("Direct Groq API Success:", result);
          
          const generatedContent = result.choices?.[0]?.message?.content || "No content generated";
          
          // Parse the response to extract module and testbench code
          let moduleCode = "";
          let testbenchCode = "";
          
          // Try to extract code using the markers
          const moduleMatch = generatedContent.match(/MODULE_CODE_START\s*([\s\S]*?)\s*MODULE_CODE_END/);
          const testbenchMatch = generatedContent.match(/TESTBENCH_CODE_START\s*([\s\S]*?)\s*TESTBENCH_CODE_END/);
          
          if (moduleMatch && testbenchMatch) {
            moduleCode = moduleMatch[1].trim();
            testbenchCode = testbenchMatch[1].trim();
          } else {
            // Fallback: try to split by common patterns
            const codeBlocks = generatedContent.split(/```(?:verilog|systemverilog)?/);
            if (codeBlocks.length >= 3) {
              moduleCode = codeBlocks[1].trim();
              testbenchCode = codeBlocks[3].trim();
            } else {
              // If parsing fails, put everything in module code
              moduleCode = generatedContent;
              testbenchCode = "// Testbench parsing failed - please check the module code above";
            }
          }
          
          const verilogResult: VerilogResult = {
            moduleCode: moduleCode || "// No module code generated",
            testbenchCode: testbenchCode || "// No testbench code generated",
            description: `Generated Verilog code for: ${circuitDescription} (Direct Groq API)`
          };
          
          localStorage.setItem('verilogResult', JSON.stringify(verilogResult));
          toast.success("Verilog code generated successfully via direct Groq API!");
          navigate("/results");
          return;
          
        } catch (error) {
          clearTimeout(timeoutId);
          console.error("Direct Groq API failed:", error);
          // Fall back to the original API
          console.log("Falling back to original API...");
        }
      }
      
      // Original API call for non-Groq providers or as fallback
      const url = "https://fastwrite-api.onrender.com/generate";
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // Increased timeout for code generation
      
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          if (response.status === 429) {
            throw new Error("Rate limit exceeded. Please try again later.");
          } else {
            let errorMessage = `Server error: ${response.status}`;
            try {
              const errorData = await response.json();
              console.error("API Error Response:", errorData);
              errorMessage = errorData.message || errorData.error || errorMessage;
              
              // Add more specific error handling for common issues
              if (response.status === 400) {
                if (errorMessage.toLowerCase().includes('model')) {
                  errorMessage = `Invalid model "${modelToUse}" for provider "${selectedAiProvider}". Please check the model name.`;
                } else if (errorMessage.toLowerCase().includes('api key') || errorMessage.toLowerCase().includes('authentication')) {
                  errorMessage = `Invalid API key for ${selectedAiProvider}. Please check your API key.`;
                } else {
                  errorMessage = `Bad request (400): ${errorMessage}. Please check your inputs.`;
                }
              }
            } catch (parseError) {
              console.error("Failed to parse error response:", parseError);
            }
            throw new Error(errorMessage);
          }
        }
        
        const result = await response.json();
        
        if (!result.text_content && !result.documentation) {
          console.warn("API returned success but no content, using fallback");
          
          const fallbackResult: VerilogResult = {
            moduleCode: `// Fallback module - API connectivity issue
module example_module(
    input wire clk,
    input wire reset,
    input wire [3:0] data_in,
    output reg [3:0] data_out
);

always @(posedge clk or posedge reset) begin
    if (reset)
        data_out <= 4'b0000;
    else
        data_out <= data_in;
end

endmodule`,
            testbenchCode: `// Fallback testbench - API connectivity issue
module example_module_tb;

reg clk, reset;
reg [3:0] data_in;
wire [3:0] data_out;

example_module uut (
    .clk(clk),
    .reset(reset),
    .data_in(data_in),
    .data_out(data_out)
);

initial begin
    clk = 0;
    forever #5 clk = ~clk;
end

initial begin
    reset = 1;
    data_in = 4'b0000;
    #10 reset = 0;
    #10 data_in = 4'b1010;
    #10 data_in = 4'b0101;
    #20 $finish;
end

endmodule`,
            description: "Generated in offline mode due to API connectivity issues."
          };
          
          localStorage.setItem('verilogResult', JSON.stringify(fallbackResult));
          
          toast.success("Verilog code generated in offline mode");
          
          navigate("/results");
          return;
        }
        
        // Parse the response to extract module and testbench code
        const responseText = result.text_content || result.documentation || "";
        
        let moduleCode = "";
        let testbenchCode = "";
        
        // Try to extract code using the markers
        const moduleMatch = responseText.match(/MODULE_CODE_START\s*([\s\S]*?)\s*MODULE_CODE_END/);
        const testbenchMatch = responseText.match(/TESTBENCH_CODE_START\s*([\s\S]*?)\s*TESTBENCH_CODE_END/);
        
        if (moduleMatch && testbenchMatch) {
          moduleCode = moduleMatch[1].trim();
          testbenchCode = testbenchMatch[1].trim();
        } else {
          // Fallback: try to split by common patterns
          const codeBlocks = responseText.split(/```(?:verilog|systemverilog)?/);
          if (codeBlocks.length >= 3) {
            moduleCode = codeBlocks[1].trim();
            testbenchCode = codeBlocks[3].trim();
          } else {
            // If parsing fails, put everything in module code
            moduleCode = responseText;
            testbenchCode = "// Testbench parsing failed - please check the module code above";
          }
        }
        
        const verilogResult: VerilogResult = {
          moduleCode: moduleCode || "// No module code generated",
          testbenchCode: testbenchCode || "// No testbench code generated",
          description: `Generated Verilog code for: ${circuitDescription}`
        };
        
        localStorage.setItem('verilogResult', JSON.stringify(verilogResult));
        
        toast.success("Verilog code generated successfully!");
        
        navigate("/results");
      } catch (error) {
        clearTimeout(timeoutId);
        
        if (error.name === 'AbortError') {
          throw new Error("Request timed out. The server might be overloaded.");
        }
        
        throw error;
      }
      
    } catch (error) {
      console.error("Error submitting form:", error);
      
      const fallbackResult: VerilogResult = {
        moduleCode: `// Error generating Verilog code: ${error.message || "Unknown error"}
// Please check your inputs and try again

module error_module(
    input wire error_in,
    output wire error_out
);

assign error_out = error_in;

endmodule`,
        testbenchCode: `// Error generating testbench
// Please try again with different settings

module error_module_tb;

reg error_in;
wire error_out;

error_module uut (
    .error_in(error_in),
    .error_out(error_out)
);

initial begin
    error_in = 0;
    #10 error_in = 1;
    #10 $finish;
end

endmodule`,
        description: `Error: ${error.message || "Unknown error"}`
      };
      
      localStorage.setItem('verilogResult', JSON.stringify(fallbackResult));
      
      toast.error(error instanceof Error ? error.message : "Failed to generate Verilog code. Using offline mode.");
      
      navigate("/results");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-4 md:py-8">
      <div className="container mx-auto px-4 max-w-full md:max-w-4xl">
        <Header 
          title="VeriGen - Verilog Code Generator"
          description="Generate complete Verilog modules and testbenches from natural language descriptions using AI."
        />

        <CardSection 
          title="Circuit Description" 
          tooltip="Describe the digital circuit you want to generate in natural language."
        >
          <CircuitInput 
            circuitDescription={circuitDescription}
            setCircuitDescription={setCircuitDescription}
            selectedAiProvider={selectedAiProvider}
            setSelectedAiProvider={setSelectedAiProvider}
            selectedAiModel={selectedAiModel}
            setSelectedAiModel={setSelectedAiModel}
            customModelName={customModelName}
            setCustomModelName={setCustomModelName}
          />
        </CardSection>

        <CardSection 
          title="Generation Preferences" 
          tooltip="Configure how your Verilog code should be generated."
        >
          <Tabs defaultValue="module" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="module">Module Settings</TabsTrigger>
              <TabsTrigger value="testbench">Testbench Settings</TabsTrigger>
              <TabsTrigger value="additional">Additional</TabsTrigger>
            </TabsList>
            
            <VerilogPreferences 
              selectedModuleFeatures={selectedModuleFeatures}
              setSelectedModuleFeatures={setSelectedModuleFeatures}
              selectedTestbenchFeatures={selectedTestbenchFeatures}
              setSelectedTestbenchFeatures={setSelectedTestbenchFeatures}
              codingStyle={codingStyle}
              setCodingStyle={setCodingStyle}
              testbenchType={testbenchType}
              setTestbenchType={setTestbenchType}
              additionalRequirements={additionalRequirements}
              setAdditionalRequirements={setAdditionalRequirements}
            />
          </Tabs>
        </CardSection>

        <CardSection 
          title="Prompt Preview" 
          tooltip="This is the prompt that will be sent to the AI to generate your Verilog code."
        >
          <VerilogPromptPreview 
            circuitDescription={circuitDescription}
            selectedModuleFeatures={selectedModuleFeatures}
            selectedTestbenchFeatures={selectedTestbenchFeatures}
            codingStyle={codingStyle}
            testbenchType={testbenchType}
            additionalRequirements={additionalRequirements}
          />
        </CardSection>

        <SubmitButton 
          onClick={handleSubmit}
          isLoading={isLoading}
          text="Generate Verilog Code"
          loadingText="Generating Verilog Code..."
        />
      </div>
    </div>
  );
};

export default Index;
