export interface VerilogResult {
  moduleCode: string;
  testbenchCode: string;
  description?: string;
}

export interface CircuitSpecification {
  description: string;
  moduleType: string;
  complexity: 'simple' | 'medium' | 'complex';
  features: string[];
}
