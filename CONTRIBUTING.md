# Contributing to TeachersPet

Thank you for your interest in contributing to TeachersPet! We welcome contributions from the community and are excited to see what you'll bring to the project.

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or higher
- Git
- A Google Gemini API key for testing
- Basic knowledge of React, TypeScript, and modern web development

### Setting Up Your Development Environment

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/TeachersPet.git
   cd TeachersPet
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Start the development server**:
   ```bash
   npm run dev
   ```

## 🎯 How to Contribute

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, please include:

- **Clear description** of the issue
- **Steps to reproduce** the behavior
- **Expected behavior** vs actual behavior
- **Screenshots** if applicable
- **Browser and OS** information
- **Console errors** if any

### Suggesting Enhancements

Enhancement suggestions are welcome! Please provide:

- **Clear description** of the enhancement
- **Use case** - why would this be useful?
- **Possible implementation** approach (if you have ideas)

### Code Contributions

#### Types of Contributions We Welcome

- **Bug fixes** - Help us squash those pesky bugs
- **Feature enhancements** - Add new functionality
- **Documentation improvements** - Help others understand the project
- **Voice system improvements** - Enhance text-to-speech capabilities
- **UI/UX improvements** - Make the interface more intuitive
- **Performance optimizations** - Make things faster
- **Browser compatibility** - Ensure it works everywhere

#### Development Process

1. **Create a feature branch** from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following our coding standards:
   - Use TypeScript with proper typing
   - Follow existing code style and patterns
   - Add comments for complex logic
   - Ensure responsive design principles

3. **Test your changes**:
   - Test in multiple browsers (Chrome, Firefox, Safari, Edge)
   - Verify voice features work properly
   - Check responsive design on mobile devices
   - Test with different subjects for curriculum generation

4. **Commit your changes** with descriptive messages:
   ```bash
   git commit -m "Add feature: improve voice control responsiveness"
   ```

5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request** with:
   - Clear title and description
   - Reference any related issues
   - Include screenshots if UI changes
   - List testing steps performed

## 📝 Coding Standards

### TypeScript

- Use strict TypeScript configuration
- Define interfaces for all data structures
- Avoid `any` types - use proper typing
- Use meaningful variable and function names

### React

- Use functional components with hooks
- Follow React best practices for performance
- Use proper key props for lists
- Handle loading states and errors gracefully

### CSS/Styling

- Use Tailwind CSS classes consistently
- Follow responsive design principles
- Maintain consistent spacing and typography
- Test across different screen sizes

### Voice Integration

- Test voice functionality thoroughly
- Ensure compatibility with ResponsiveVoice.js free tier
- Handle audio permission states gracefully
- Provide fallbacks for unsupported browsers

## 🧪 Testing Guidelines

### Manual Testing Checklist

- [ ] App loads without errors
- [ ] Curriculum generation works with various subjects
- [ ] Voice controls (play/pause/stop) function properly
- [ ] Text-to-speech reads complete content without truncation
- [ ] Settings are saved and persist across sessions
- [ ] Responsive design works on mobile devices
- [ ] No console errors in browser developer tools

### Voice System Testing

- [ ] ResponsiveVoice loads without API key errors
- [ ] Audio plays without permission prompts on load
- [ ] Voice controls respond correctly
- [ ] Long content reads completely without stopping
- [ ] Settings panel shows appropriate voice options

## 🚫 What We Don't Accept

- Changes that break existing functionality
- Code without proper TypeScript typing
- Features that require paid services without fallbacks
- Contributions that violate ResponsiveVoice.js license terms
- Code that doesn't follow our styling guidelines
- Changes without adequate testing

## 📋 Pull Request Process

1. **Ensure your PR**:
   - Has a clear, descriptive title
   - Includes a detailed description of changes
   - References relevant issues (use "Fixes #123" format)
   - Passes all manual testing criteria

2. **The review process**:
   - Maintainers will review your PR
   - You may be asked to make changes
   - Once approved, your PR will be merged

3. **After merging**:
   - Your contribution will be included in the next release
   - You'll be added to the contributors list

## 🎨 Areas Where We Need Help

### High Priority
- **Browser compatibility testing** - Ensure it works across all browsers
- **Mobile optimization** - Improve mobile user experience
- **Voice system enhancements** - Better voice controls and options
- **Error handling** - More robust error handling and user feedback

### Medium Priority
- **Documentation improvements** - Better examples and guides
- **Performance optimizations** - Faster loading and rendering
- **Accessibility features** - Screen reader support, keyboard navigation
- **New curriculum templates** - Additional subject-specific templates

### Low Priority
- **UI polish** - Visual improvements and animations
- **Additional features** - New functionality ideas
- **Code cleanup** - Refactoring and optimization

## 💬 Communication

- **GitHub Issues** - For bug reports and feature requests
- **Pull Request discussions** - For code review and collaboration
- **Project discussions** - For general project planning

## 🏆 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes for significant contributions
- GitHub contributors graph

## 📚 Resources

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [ResponsiveVoice Documentation](https://responsivevoice.org/api/)
- [Voice Integration Guide](./VOICE_INTEGRATION_DOCUMENTATION.md)

## ❓ Questions?

If you have questions about contributing, please:
1. Check existing issues and discussions
2. Create a new issue with the "question" label
3. Be patient - we'll get back to you as soon as possible

---

**Thank you for helping make TeachersPet better for everyone! 🎓**