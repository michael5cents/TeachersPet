import React, { useEffect, useRef, useState } from 'react';
import VoiceControls from './VoiceControls';
import { useVoice } from '../contexts/VoiceContext';

// Make sure Marked and KaTeX are available on the window object from the CDN
declare global {
    interface Window {
        marked: {
            parse: (markdown: string) => string;
        };
        renderMathInElement: (element: HTMLElement, options?: any) => void;
    }
}

interface VoiceContentRendererProps {
    markdownContent: string;
    showVoiceControls?: boolean;
    sectionTitle?: string;
    id?: string; // Unique identifier for voice controls
}

const VoiceContentRenderer: React.FC<VoiceContentRendererProps> = ({ 
    markdownContent, 
    showVoiceControls = true,
    sectionTitle = 'Content',
    id
}) => {
    const contentRef = useRef<HTMLDivElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [highlightedWordIndex, setHighlightedWordIndex] = useState<number>(-1);
    const [processedWords, setProcessedWords] = useState<string[]>([]);
    const { settings } = useVoice();

    useEffect(() => {
        if (contentRef.current && window.renderMathInElement) {
            // Render LaTeX math expressions within the element
            window.renderMathInElement(contentRef.current, {
                delimiters: [
                    {left: '$$', right: '$$', display: true},
                    {left: '$', right: '$', display: false},
                    {left: '\\(', right: '\\)', display: false},
                    {left: '\\[', right: '\\]', display: true}
                ],
                throwOnError: false
            });
        }
    }, [markdownContent]);

    // Preprocess content to ensure proper formatting
    const preprocessContent = (content: string) => {
        // First, decode any URL encoding
        let processed = content;
        try {
            processed = decodeURIComponent(content);
        } catch (e) {
            // If decoding fails, use original content
            processed = content;
        }
        
        // Fix bold text spacing issues
        processed = processed
            // Fix bold text that has weird indentation
            .replace(/\s+\*\*([^*]+)\*\*/g, ' **$1**')  // Fix spaced bold
            .replace(/\*\*([^*]+)\*\*\s+/g, '**$1** ')  // Fix trailing spaces on bold
            // Ensure proper line breaks for paragraphs
            .replace(/\n\n/g, '\n\n')  // Preserve double line breaks
            .replace(/\n([^#*-\d\s])/g, '\n\n$1')  // Add line breaks before non-list/header content
            .trim();

        // Ensure headers have proper spacing
        processed = processed.replace(/^([^#\n]*)\n(#{1,6}\s)/gm, '$1\n\n$2');
        
        // Clean up excessive whitespace
        processed = processed.replace(/[ \t]+/g, ' ');  // Multiple spaces to single space
        processed = processed.replace(/\n\s+/g, '\n');  // Remove leading spaces on new lines
        
        return processed;
    };

    // Parse markdown to HTML
    const processedContent = preprocessContent(markdownContent);
    const htmlContent = window.marked ? window.marked.parse(processedContent) : processedContent;

    // Process text into words for highlighting
    useEffect(() => {
        const cleanText = processedContent
            .replace(/#{1,6}\s/g, '') // Remove headers
            .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
            .replace(/\*(.*?)\*/g, '$1') // Remove italic
            .replace(/`(.*?)`/g, '$1') // Remove code
            .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links, keep text
            .replace(/>\s/g, '') // Remove blockquotes
            .replace(/\n+/g, ' ') // Replace line breaks with spaces
            .replace(/\s+/g, ' ') // Normalize spaces
            .trim();
        
        const words = cleanText.split(/\s+/).filter(word => word.length > 0);
        console.log('VoiceContentRenderer - processed words:', words.length, 'first 10:', words.slice(0, 10));
        setProcessedWords(words);
    }, [processedContent]);

    // Word highlighting disabled - just return normal content
    const createHighlightedContent = () => {
        return htmlContent;
    };

    const handleVoiceStart = () => {
        setIsPlaying(true);
        setHighlightedWordIndex(-1);
    };

    const handleVoiceEnd = () => {
        setIsPlaying(false);
        setHighlightedWordIndex(-1);
    };

    const handleVoiceError = (error: string) => {
        console.error('Voice error:', error);
        setIsPlaying(false);
        setHighlightedWordIndex(-1);
    };

    const handleWordBoundary = (wordIndex: number) => {
        console.log('Word boundary callback - highlighting word index:', wordIndex);
        setHighlightedWordIndex(wordIndex);
    };

    return (
        <div className="space-y-4">
            {/* Voice Controls */}
            {showVoiceControls && settings.enabled && (
                <div className="border-l-4 border-indigo-200 bg-indigo-50 p-4 rounded-r-lg">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.824L4.936 14H2a1 1 0 01-1-1V7a1 1 0 011-1h2.936l3.447-2.824z" clipRule="evenodd" />
                                <path d="M14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.983 5.983 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.984 3.984 0 00-1.172-2.828 1 1 0 010-1.415z" />
                            </svg>
                            <h4 className="text-sm font-medium text-indigo-800">
                                Listen to {sectionTitle}
                            </h4>
                        </div>
                        {isPlaying && (
                            <span className="text-xs text-indigo-600 font-medium">
                                Playing...
                            </span>
                        )}
                    </div>
                    <VoiceControls
                        text={markdownContent}
                        id={id || `voice-${sectionTitle.toLowerCase().replace(/\s+/g, '-')}`}
                        onStart={handleVoiceStart}
                        onEnd={handleVoiceEnd}
                        onError={handleVoiceError}
                        onWordBoundary={handleWordBoundary}
                        words={processedWords}
                    />
                </div>
            )}

            {/* Content */}
            <div
                ref={contentRef}
                className={`rendered-content ${isPlaying ? 'ring-2 ring-indigo-200 ring-opacity-50' : ''}`}
                dangerouslySetInnerHTML={{ __html: createHighlightedContent() }}
            />
        </div>
    );
};

export default VoiceContentRenderer;