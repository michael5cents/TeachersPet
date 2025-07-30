# TeachersPet - AI Curriculum Architect 🎓

> Your AI-powered Master Educator that creates comprehensive, interactive learning curricula with text-to-speech capabilities.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?logo=vite&logoColor=FFD62E)](https://vitejs.dev/)

## ✨ Features

- **🤖 AI-Powered Curriculum Generation** - Creates comprehensive lesson plans using Google's Gemini AI
- **🔊 Text-to-Speech Integration** - Full curriculum content can be read aloud using ResponsiveVoice.js
- **📚 Interactive Learning Modules** - Structured lessons with assessments and quizzes
- **💾 Progress Tracking** - Save and resume learning sessions
- **📱 Responsive Design** - Works seamlessly on desktop and mobile devices
- **🎯 Personalized Content** - Generates content tailored to specific subjects and learning objectives

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ (for development)
- A Google Gemini API key
- Modern web browser with JavaScript enabled

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/michael5cents/TeachersPet.git
   cd TeachersPet
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up your API key**
   - Get a free API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - The app will prompt you to enter it on first use
   - Your key is stored locally in your browser

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   - Navigate to `http://localhost:5173`
   - Enter a subject (e.g., "Quantum Mechanics", "The French Revolution")
   - Watch as your AI curriculum architect creates a comprehensive learning program!

## 🎯 How It Works

1. **Enter a Subject** - Type any topic you want to learn about
2. **AI Analysis** - Gemini AI analyzes the subject and creates structured content
3. **Curriculum Generation** - Comprehensive lessons, objectives, and assessments are generated
4. **Interactive Learning** - Navigate through modules with built-in voice narration
5. **Progress Tracking** - Save your progress and resume anytime

## 🔊 Voice Features

TeachersPet includes advanced text-to-speech capabilities:

- **Full Content Narration** - Every lesson can be read aloud
- **Reliable Playback** - No truncation issues with long content
- **Browser Compatible** - Uses ResponsiveVoice.js for consistent experience
- **Simple Controls** - Play, pause, and stop functionality

### Voice Setup

The voice system works out of the box with no configuration required:
- Uses ResponsiveVoice.js free tier (non-commercial)
- Automatically falls back to browser's default voice
- No API keys needed for basic functionality

## 🛠️ Technology Stack

- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **AI Integration**: Google Gemini API
- **Text-to-Speech**: ResponsiveVoice.js
- **Math Rendering**: KaTeX
- **Markdown Processing**: Marked.js

## 📁 Project Structure

```
TeachersPet/
├── components/           # React components
│   ├── VoiceControls.tsx    # Audio playback controls
│   ├── VoiceSettings.tsx    # Voice configuration
│   ├── MainContent.tsx      # Main curriculum display
│   └── Sidebar.tsx          # Navigation sidebar
├── contexts/            # React contexts
│   └── VoiceContext.tsx     # Global voice state management
├── services/            # API and external services
│   └── geminiService.ts     # Google Gemini integration
├── types/              # TypeScript type definitions
├── docs/               # Documentation
│   ├── VOICE_INTEGRATION_DOCUMENTATION.md
│   └── RESPONSIVEVOICE_QUICKSTART.md
└── index.html          # Main HTML entry point
```

## 🎨 Usage Examples

### Basic Curriculum Generation
```typescript
// Enter any subject in the interface
"Ancient Roman History"
"Introduction to Machine Learning"
"Molecular Biology Basics"
"Creative Writing Techniques"
```

### Voice Integration
```typescript
// Voice controls are automatically added to all content
// Users can click play buttons to hear any section
// Full text is read without truncation
```

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes** with proper documentation
4. **Test thoroughly** across different browsers
5. **Commit your changes** (`git commit -m 'Add amazing feature'`)
6. **Push to the branch** (`git push origin feature/amazing-feature`)
7. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Maintain existing code style
- Add tests for new features
- Update documentation for significant changes
- Ensure voice features work across browsers

## 🐛 Troubleshooting

### Common Issues

**Voice not working?**
- Check browser audio permissions
- Ensure you're not in an iframe
- Try refreshing the page

**Curriculum not generating?**
- Verify your Gemini API key is valid
- Check browser console for errors
- Ensure stable internet connection

**Styling issues?**
- Clear browser cache
- Verify Tailwind CSS is loading properly

See our [Voice Integration Documentation](./VOICE_INTEGRATION_DOCUMENTATION.md) for detailed troubleshooting.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gemini AI** - For powerful content generation capabilities
- **ResponsiveVoice.js** - For reliable text-to-speech functionality
- **Tailwind CSS** - For beautiful, responsive styling
- **React Team** - For the amazing framework
- **Vite** - For lightning-fast development experience

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/michael5cents/TeachersPet/issues)
- **Documentation**: [Voice Integration Guide](./VOICE_INTEGRATION_DOCUMENTATION.md)
- **Quick Start**: [ResponsiveVoice Setup](./RESPONSIVEVOICE_QUICKSTART.md)

## 🌟 Star History

If you find TeachersPet useful, please consider giving it a star! ⭐

---

**Built with ❤️ for educators and learners everywhere**

*TeachersPet - Making AI-powered education accessible to all*