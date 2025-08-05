# VeriGen - AI-Powered Verilog Generator

VeriGen is a modern web application that generates complete Verilog modules and testbenches from natural language descriptions using AI. Simply describe your digital circuit in plain English, and VeriGen will create synthesizable Verilog code with comprehensive testbenches.

## Features

- **Natural Language Input**: Describe circuits in plain English
- **Complete Code Generation**: Generates both module and testbench files
- **Multiple AI Providers**: Support for OpenAI, Google, Groq, and OpenRouter
- **Flexible Coding Styles**: Behavioral, structural, or mixed modeling
- **Comprehensive Testbenches**: Basic, comprehensive, or self-checking testbenches
- **Syntax Highlighting**: Beautiful code display with syntax highlighting
- **Easy Export**: Copy to clipboard or download as .v files
- **Responsive Design**: Works on desktop and mobile devices

## Supported Circuit Types

- Combinational circuits (multiplexers, decoders, encoders, ALUs)
- Sequential circuits (flip-flops, counters, shift registers)
- Finite state machines (FSMs)
- Memory elements
- Custom digital circuits

## Example Circuits

- 4-to-1 multiplexer using case statement
- 8-bit ripple carry adder
- D flip-flop with asynchronous reset
- 3-to-8 decoder with enable
- 4-bit counter with load and reset
- Simple ALU with 4 operations
- Traffic light controller FSM

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/vergen-ui.git
cd vergen-ui
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### API Keys

VeriGen requires API keys from AI providers. Get your keys from:

- **OpenAI**: https://platform.openai.com/api-keys
- **Google**: https://aistudio.google.com/app/apikey
- **Groq**: https://console.groq.com/keys
- **OpenRouter**: https://openrouter.ai/settings/keys

API keys are stored locally in your browser and never sent to our servers.

## Usage

1. **Describe Your Circuit**: Enter a natural language description of the digital circuit you want to create
2. **Choose AI Provider**: Select your preferred AI provider and model
3. **Configure Generation**: Set coding style, testbench type, and additional features
4. **Generate Code**: Click "Generate Verilog Code" to create your files
5. **Download/Copy**: Use the generated module.v and testbench.v files in your projects

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **UI Components**: Radix UI with Tailwind CSS
- **Syntax Highlighting**: Prism.js
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom components

## Project Structure

```
src/
├── components/          # React components
│   ├── CircuitInput.tsx        # Circuit description input
│   ├── VerilogPreferences.tsx  # Generation preferences
│   ├── VerilogPromptPreview.tsx # Prompt preview
│   └── ui/             # UI components
├── pages/              # Page components
│   ├── Index.tsx       # Main generator page
│   └── Results.tsx     # Results display page
├── types/              # TypeScript type definitions
│   └── verilog.ts      # Verilog-related types
└── hooks/              # Custom React hooks
```

## Contributing

We welcome contributions! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions, please:

1. Check the existing issues on GitHub
2. Create a new issue with detailed information
3. Contact us through the project repository

## Acknowledgments

- Built with modern React and TypeScript
- UI components from Radix UI
- Styling with Tailwind CSS
- Syntax highlighting by Prism.js
- AI integration with multiple providers

---

**VeriGen** - Making Verilog development faster and more accessible through AI.
