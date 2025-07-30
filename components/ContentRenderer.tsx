import React, { useEffect, useRef } from 'react';

// Make sure Marked and KaTeX are available on the window object from the CDN
declare global {
    interface Window {
        marked: {
            parse: (markdown: string) => string;
        };
        renderMathInElement: (element: HTMLElement, options?: any) => void;
    }
}

interface ContentRendererProps {
    markdownContent: string;
}

const ContentRenderer: React.FC<ContentRendererProps> = ({ markdownContent }) => {
    const contentRef = useRef<HTMLDivElement>(null);

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

    return (
      <div
        ref={contentRef}
        className="rendered-content"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    );
};

export default ContentRenderer;