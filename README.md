# Teacher's Pet - AI-Powered Learning Adventures 🎓

> Your AI-powered Master Educator for comprehensive, interactive learning curricula with advanced text-to-speech.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?logo=vite&logoColor=FFD62E)](https://vitejs.dev/)

## ✨ Core Features

### 🤖 **AI Curriculum Generation**
- Creates comprehensive lesson plans using Google's Gemini AI
- Generates detailed modules with learning objectives, content, and assessments
- Adapts content complexity based on subject matter
- Supports any educational topic from basic concepts to advanced subjects

### 🔊 **Advanced Text-to-Speech System**
- Full curriculum content narration
- Section-by-section playback with individual controls
- Handles long content seamlessly
- Browser-compatible voice synthesis
- Play/pause/stop controls for each content section

### 📚 **Interactive Learning Experience**
- Structured multi-module lessons with clear learning paths
- Interactive quizzes with multiple question types (multiple-choice, true/false, short-answer)
- Real-time progress tracking and completion status
- Session save/resume functionality with localStorage persistence

### 🎨 **Modern User Interface**
- Clean, gradient-based design with "Teacher's Pet" branding
- Responsive layout optimized for desktop and mobile
- Sidebar navigation with module overview
- Loading states with detailed progress indicators

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ (for development)
- A Google Gemini API key (free tier available)
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
   - Enter any subject (e.g., "Spanish", "Quantum Physics", "Guitar Playing")
   - Watch Teacher's Pet create a comprehensive learning program!

## 🎯 How It Works

1. **📝 Subject Input** - Enter any topic you want to learn about
2. **🧠 AI Analysis** - Gemini AI analyzes the subject and creates structured content
3. **📚 Curriculum Generation** - Comprehensive lessons, objectives, and assessments are generated
4. **🔍 Interactive Learning** - Navigate through modules with voice narration
5. **💾 Progress Tracking** - Save your progress and resume anytime

## 🔊 Voice Features

TeachersPet includes advanced text-to-speech capabilities:

- **Full Content Narration** - Every lesson can be read aloud
- **Reliable Playback** - Handles long content
- **Browser Compatible** - Uses browser's built-in voice synthesis
- **Simple Controls** - Play, pause, and stop functionality

## 🛠️ Technology Stack

- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**: Vite 5.2+
- **Styling**: Tailwind CSS with custom gradients
- **State Management**: React Context + localStorage
- **AI Integration**: Google Gemini 2.5 Flash API
- **Math Rendering**: KaTeX for mathematical expressions
- **Markdown Processing**: Marked.js for content formatting

## 📁 Project Architecture

```
Teacher's Pet/
├── components/                 # React components
│   ├── ApiSettings.tsx           # API key management
│   ├── icons.tsx                 # SVG icon components
│   ├── Loader.tsx                # Loading animations
│   ├── MainContent.tsx           # Main curriculum interface
│   ├── Quiz.tsx                  # Interactive assessments
│   ├── Sidebar.tsx               # Navigation and progress
│   ├── VoiceContentRenderer.tsx  # Content with voice integration
│   ├── VoiceControls.tsx         # Audio playback controls
│   └── VoiceSettings.tsx         # Voice configuration UI
├── contexts/
│   └── VoiceContext.tsx          # Global voice state management
├── services/
│   └── geminiService.ts          # Google Gemini AI integration
├── types.ts                      # TypeScript type definitions
├── vite.config.ts                # Vite configuration
├── tsconfig.json                 # TypeScript config
├── index.html                    # Main HTML entry point
```

## 🎨 Usage Examples

### Subject Examples That Work Great
```
Language Learning:
- "Spanish" → Creates modules from greetings to advanced grammar
- "French Conversation" → Focus on practical speaking skills
- "Mandarin Chinese" → Covers pronunciation, characters, and culture

STEM Subjects:
- "Quantum Physics" → From basic concepts to advanced theories
- "Organic Chemistry" → Molecular structures to reaction mechanisms
- "Machine Learning" → Algorithms, neural networks, and applications

Creative & Practical:
- "Guitar Playing" → Chords, techniques, music theory
- "Digital Photography" → Camera settings, composition, editing
- "Creative Writing" → Story structure, character development, genres

History & Culture:
- "Ancient Roman Empire" → Politics, culture, military, legacy
- "World War II" → Comprehensive historical analysis
- "Renaissance Art" → Artists, techniques, cultural impact
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
- Verify your Gemini API key is valid at [Google AI Studio](https://makersuite.google.com/app/apikey)
- Check browser console for API errors
- Ensure stable internet connection
- Try a different subject if one isn't working

**Performance issues?**
- Large curricula with many modules may take time to load
- Clear browser cache if experiencing slowness

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🚀 Recent Updates (v2.0.0)

### Major Changes
- ❌ **Video features removed**: All video integration and related UI have been removed for a streamlined, privacy-focused experience.
- ✅ **AI Curriculum Generation**: Enhanced Gemini-powered content creation.
- ✅ **Voice Features**: Improved text-to-speech and voice controls.
- ✅ **UI/UX Improvements**: Modern, responsive design and better accessibility.
- ✅ **Performance**: Faster curriculum generation and improved state management.

## 🙏 Acknowledgments

- **Google Gemini AI** - For powerful curriculum generation capabilities
- **Tailwind CSS** - For beautiful, responsive styling system
- **React Team** - For the amazing component framework
- **Vite** - For lightning-fast development experience

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/michael5cents/TeachersPet/issues)

---

**Teacher's Pet - AI-Powered Learning Adventures**
*Making comprehensive education accessible to everyone, everywhere*
