import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { ArrowLeft, Download, Copy, FileCode, TestTube } from "lucide-react";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { VerilogResult } from "@/types/verilog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

const Results = () => {
  const location = useLocation();
  const [result, setResult] = useState<VerilogResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const storedResult = localStorage.getItem("verilogResult");

        if (storedResult) {
          const parsedResult = JSON.parse(storedResult) as VerilogResult;
          setResult(parsedResult);
        } else {
          toast.error("No Verilog results found. Please generate code first.");
          setResult({
            moduleCode: "// No Verilog results found\n// Please go back to the generator page and create code first.",
            testbenchCode: "// No testbench results found\n// Please go back to the generator page and create code first.",
            description: "No results found"
          });
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching results:", error);
        toast.error("Failed to load Verilog results");
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [location]);

  const handleCopyCode = (code: string, type: string) => {
    navigator.clipboard.writeText(code).then(() => {
      toast.success(`${type} code copied to clipboard!`);
    }).catch(() => {
      toast.error("Failed to copy code to clipboard");
    });
  };

  const handleDownloadCode = (code: string, filename: string) => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`${filename} downloaded successfully!`);
  };

  const handleDownloadBoth = () => {
    if (!result) return;
    
    // Create a zip-like structure by combining both files
    const combinedContent = `// ============================================
// MODULE FILE (module.v)
// ============================================

${result.moduleCode}

// ============================================
// TESTBENCH FILE (testbench.v)
// ============================================

${result.testbenchCode}`;

    handleDownloadCode(combinedContent, 'verilog_files.v');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-lg md:text-xl text-slate-600">Loading Verilog results...</div>
      </div>
    );
  }

  const RenderHeader = () => (
    <header className="flex justify-between items-center mb-6 flex-wrap gap-3">
      <div className="flex items-center gap-2">
        <Link to="/">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Generator
          </Button>
        </Link>
        <h1 className="text-xl md:text-2xl font-bold text-slate-900">Generated Verilog Code</h1>
      </div>
      <div className="flex gap-2">
        {result && (
          <>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleCopyCode(result.moduleCode, "Module")}
            >
              <Copy className="h-4 w-4 mr-1" />
              Copy Module
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleCopyCode(result.testbenchCode, "Testbench")}
            >
              <Copy className="h-4 w-4 mr-1" />
              Copy Testbench
            </Button>
            <Button 
              variant="default" 
              size="sm" 
              onClick={handleDownloadBoth}
            >
              <Download className="h-4 w-4 mr-1" />
              Download All
            </Button>
          </>
        )}
      </div>
    </header>
  );

  const CodeCard = ({ title, code, filename, icon }: { title: string; code: string; filename: string; icon: React.ReactNode }) => (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          {icon}
          {title}
          <div className="ml-auto flex gap-1">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleCopyCode(code, title)}
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleDownloadCode(code, filename)}
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="bg-slate-900 rounded-md overflow-hidden">
          <SyntaxHighlighter
            language="verilog"
            style={tomorrow}
            customStyle={{
              margin: 0,
              padding: '1rem',
              fontSize: '0.875rem',
              lineHeight: '1.5'
            }}
            showLineNumbers={true}
            wrapLines={true}
          >
            {code}
          </SyntaxHighlighter>
        </div>
      </CardContent>
    </Card>
  );

  if (isMobile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-4">
        <div className="container mx-auto px-4">
          <RenderHeader />
          {result && (
            <Tabs defaultValue="module" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="module">Module Code</TabsTrigger>
                <TabsTrigger value="testbench">Testbench Code</TabsTrigger>
              </TabsList>
              
              <TabsContent value="module" className="mt-4">
                <CodeCard 
                  title="Module Code"
                  code={result.moduleCode}
                  filename="module.v"
                  icon={<FileCode className="h-5 w-5" />}
                />
              </TabsContent>
              
              <TabsContent value="testbench" className="mt-4">
                <CodeCard 
                  title="Testbench Code"
                  code={result.testbenchCode}
                  filename="testbench.v"
                  icon={<TestTube className="h-5 w-5" />}
                />
              </TabsContent>
            </Tabs>
          )}
          
          {result?.description && (
            <Card className="mt-4">
              <CardContent className="p-4">
                <p className="text-sm text-slate-600">{result.description}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-6 md:py-8">
      <div className="container max-w-7xl mx-auto px-4">
        <RenderHeader />
        {result && (
          <>
            <ResizablePanelGroup
              direction="horizontal"
              className="min-h-[70vh] border rounded-lg bg-white shadow-md overflow-hidden"
            >
              <ResizablePanel defaultSize={50} minSize={30}>
                <div className="h-full">
                  <CodeCard 
                    title="Module Code (module.v)"
                    code={result.moduleCode}
                    filename="module.v"
                    icon={<FileCode className="h-5 w-5" />}
                  />
                </div>
              </ResizablePanel>
              
              <ResizableHandle withHandle />
              
              <ResizablePanel defaultSize={50} minSize={30}>
                <div className="h-full">
                  <CodeCard 
                    title="Testbench Code (testbench.v)"
                    code={result.testbenchCode}
                    filename="testbench.v"
                    icon={<TestTube className="h-5 w-5" />}
                  />
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
            
            {result.description && (
              <Card className="mt-4">
                <CardContent className="p-4">
                  <p className="text-slate-600">{result.description}</p>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Results;
