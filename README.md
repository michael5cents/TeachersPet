# Teacher's Pet - AI-Powered Learning Adventures 🎓

> Your AI-powered Master Educator that creates comprehensive, interactive learning curricula with text-to-speech capabilities.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?logo=vite&logoColor=FFD62E)](https://vitejs.dev/)

## ✨ Core Features

### 🤖 **Advanced AI Curriculum Generation**
- Creates comprehensive lesson plans using Google's Gemini AI
- Generates detailed modules with learning objectives, content, and assessments
- Adapts content complexity based on subject matter
- Supports any educational topic from basic concepts to advanced subjects

### 🎥 **Multi-Platform Video Integration**
- **YouTube Integration**: Primary video source with educational content filtering
- **PeerTube Fallback**: Searches 5 educational PeerTube instances when YouTube quota exceeded
- **Smart Video Selection**: Subject-relevant filtering ensures videos match the curriculum topic
- **Video Deduplication**: Prevents repeat videos across different modules
- **Platform Support**: YouTube, PeerTube, Vimeo, Khan Academy, TED-Ed ready

### 🔊 **Advanced Text-to-Speech System**
- Full curriculum content narration using ResponsiveVoice.js
- Section-by-section playback with individual controls
- No truncation issues - handles long content seamlessly
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
- Video player integration with platform-specific styling
- Loading states with detailed progress indicators

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ (for development)
- A Google Gemini API key (free tier available)
- Modern web browser with JavaScript enabled
- Internet connection for video content and AI generation

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
   - Watch Teacher's Pet create a comprehensive learning program with videos!

## 🎯 How It Works

1. **📝 Subject Input** - Enter any topic you want to learn about
2. **🧠 AI Analysis** - Gemini AI analyzes the subject and creates structured content
3. **📚 Curriculum Generation** - Comprehensive lessons, objectives, and assessments are generated
4. **🎥 Video Enhancement** - Searches YouTube/PeerTube for relevant educational videos
5. **🔍 Smart Filtering** - Ensures videos match your subject with relevance scoring
6. **📖 Interactive Learning** - Navigate through modules with voice narration and embedded videos
7. **💾 Progress Tracking** - Save your progress and resume anytime

### Video Integration Process

- **Primary Search**: YouTube API searches for educational content
- **Quota Management**: Automatically falls back to PeerTube when YouTube quota exceeded
- **Multi-Instance Search**: Searches 5 educational PeerTube instances for diverse content
- **Relevance Filtering**: Prioritizes videos containing the main subject in title/description
- **Deduplication**: Ensures unique videos across all modules
- **Platform Support**: Displays videos from YouTube, PeerTube, and other educational platforms

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

### Core Technologies
- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**: Vite 5.2+
- **Styling**: Tailwind CSS with custom gradients
- **State Management**: React Context + localStorage

### AI & Content
- **AI Integration**: Google Gemini 2.5 Flash API
- **Text-to-Speech**: ResponsiveVoice.js (free tier)
- **Math Rendering**: KaTeX for mathematical expressions
- **Markdown Processing**: Marked.js for content formatting

### Video Integration
- **Primary Platform**: YouTube Data API v3
- **Fallback Platform**: PeerTube (5 educational instances)
- **Video Processing**: Custom relevance scoring and deduplication
- **Supported Platforms**: YouTube, PeerTube, Vimeo, Khan Academy, TED-Ed

## 📁 Project Architecture

```
Teacher's Pet/
├── components/                 # React components
│   ├── VoiceControls.tsx         # Audio playback controls
│   ├── VoiceSettings.tsx         # Voice configuration UI
│   ├── VoiceContentRenderer.tsx  # Content with voice integration
│   ├── VideoPlayer.tsx           # Multi-platform video player
│   ├── VideoSuggestions.tsx      # Video recommendation display
│   ├── MainContent.tsx           # Main curriculum interface
│   ├── Sidebar.tsx               # Navigation and progress
│   ├── Quiz.tsx                  # Interactive assessments
│   ├── ContentRenderer.tsx       # Markdown/math rendering
│   ├── ApiSettings.tsx           # API key management
│   ├── Loader.tsx                # Loading animations
│   └── icons.tsx                 # SVG icon components
├── contexts/                   # React contexts
│   └── VoiceContext.tsx          # Global voice state management
├── services/                  # External service integrations
│   ├── geminiService.ts          # Google Gemini AI integration
│   └── videoSearchService.ts     # Multi-platform video search
├── types.ts                   # TypeScript type definitions
├── vite.config.ts            # Vite configuration
├── tailwind.config.js        # Tailwind CSS configuration
└── index.html               # Main HTML entry point with CDN links
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

### Advanced Features in Action
```typescript
// Multi-platform video integration
- YouTube videos for mainstream subjects
- PeerTube fallback for specialized content
- Subject-relevant filtering ensures content quality

// Voice narration system
- Click any play button to hear content
- Section-by-section playback
- No character limits or truncation issues

// Progress tracking
- Save/resume sessions automatically
- Track quiz completions across modules
- Visual progress indicators in sidebar
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

**Videos not appearing?**
- YouTube API quota may be exceeded (automatically falls back to PeerTube)
- Check browser console for 403 errors from YouTube
- PeerTube videos should appear when YouTube fails
- Ensure internet connection is stable

**Voice not working?**
- Check browser audio permissions
- Ensure you're not in an iframe
- Try refreshing the page
- ResponsiveVoice requires user interaction to start

**Curriculum not generating?**
- Verify your Gemini API key is valid at [Google AI Studio](https://makersuite.google.com/app/apikey)
- Check browser console for API errors
- Ensure stable internet connection
- Try a different subject if one isn't working

**Video player issues?**
- PeerTube videos may load slower than YouTube
- Some instances may be temporarily unavailable
- Refresh the page if videos aren't loading
- Check browser console for CORS or network errors

**Performance issues?**
- Large curricula with many modules may take time to load
- Video search across multiple platforms adds processing time
- Clear browser cache if experiencing slowness

See our [Voice Integration Documentation](./VOICE_INTEGRATION_DOCUMENTATION.md) for detailed troubleshooting.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🚀 Recent Updates (v1.0.0)

### Video Integration Overhaul
- ✅ **Multi-Platform Support**: YouTube + PeerTube fallback system
- ✅ **Smart Filtering**: Subject-relevant video selection with relevance scoring
- ✅ **Deduplication**: Unique videos across all modules
- ✅ **5 PeerTube Instances**: Comprehensive educational content coverage

### UI/UX Improvements
- ✅ **"Teacher's Pet" Branding**: Clean, professional design refresh
- ✅ **Gradient Styling**: Modern visual appeal with purple/pink/indigo themes
- ✅ **Responsive Layout**: Optimized for all screen sizes
- ✅ **Loading States**: Detailed progress indicators during generation

### Technical Enhancements
- ✅ **React 19**: Latest React features and performance improvements
- ✅ **TypeScript**: Full type safety across the application
- ✅ **Error Handling**: Robust fallback systems for API failures
- ✅ **localStorage**: Persistent session management

## 🙏 Acknowledgments

- **Google Gemini AI** - For powerful curriculum generation capabilities
- **ResponsiveVoice.js** - For reliable, free text-to-speech functionality
- **PeerTube Community** - For decentralized, educational video hosting
- **YouTube Edu Creators** - For quality educational content
- **Tailwind CSS** - For beautiful, responsive styling system
- **React Team** - For the amazing component framework
- **Vite** - For lightning-fast development experience

## 📞 Support & Documentation

- **Issues**: [GitHub Issues](https://github.com/michael5cents/TeachersPet/issues)
- **Voice Integration**: [Complete Voice Guide](./VOICE_INTEGRATION_DOCUMENTATION.md)
- **ResponsiveVoice**: [Quick Setup Guide](./RESPONSIVEVOICE_QUICKSTART.md)
- **Contributing**: [Contribution Guidelines](./CONTRIBUTING.md)

## 🌟 Star History

If you find Teacher's Pet useful, please consider giving it a star! ⭐

---

**Teacher's Pet - AI-Powered Learning Adventures**
*Making comprehensive education accessible to everyone, everywhere*