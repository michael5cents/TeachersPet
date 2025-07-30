import { GoogleGenAI, Type } from "@google/genai";
import type { Curriculum } from '../types';
import { videoSearchService, type VideoResult } from './videoSearchService';

const API_KEY = "AIzaSyDMbEoTxb4C5tFG_P28jVDpn3Q0uUNbVSo";

const ai = new GoogleGenAI({ apiKey: API_KEY });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        subject: { type: Type.STRING },
        programOverview: { 
            type: Type.STRING,
            description: "A summary of the entire course, formatted in GitHub-flavored Markdown."
        },
        modules: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    moduleNumber: { type: Type.INTEGER },
                    title: { type: Type.STRING },
                    learningObjectives: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING }
                    },
                    content: { 
                        type: Type.STRING,
                        description: "The lesson content, formatted in GitHub-flavored Markdown. Use LaTeX for math/formulas ($inline$ or $$display$$)."
                    },
                    videos: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                title: { type: Type.STRING },
                                platform: { type: Type.STRING },
                                relevanceDescription: { type: Type.STRING }
                            },
                            required: ['title', 'platform', 'relevanceDescription']
                        },
                        description: "Recommended educational videos related to this module's content"
                    },
                    quiz: {
                        type: Type.OBJECT,
                        properties: {
                            questions: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        question: { type: Type.STRING },
                                        type: { type: Type.STRING, enum: ['multiple-choice', 'true-false', 'short-answer'] },
                                        options: {
                                            type: Type.ARRAY,
                                            items: { type: Type.STRING },
                                            nullable: true,
                                        },
                                        answer: { type: Type.STRING }
                                    },
                                    required: ['question', 'type', 'answer']
                                }
                            }
                        },
                        required: ['questions']
                    }
                },
                required: ['moduleNumber', 'title', 'learningObjectives', 'content', 'quiz']
            }
        },
        finalTest: {
            type: Type.OBJECT,
            properties: {
                questions: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            question: { type: Type.STRING },
                            type: { type: Type.STRING, enum: ['multiple-choice', 'true-false', 'short-answer'] },
                            options: {
                                type: Type.ARRAY,
                                items: { type: Type.STRING },
                                nullable: true,
                            },
                            answer: { type: Type.STRING }
                        },
                        required: ['question', 'type', 'answer']
                    }
                }
            },
            required: ['questions']
        }
    },
    required: ['subject', 'programOverview', 'modules', 'finalTest']
};


export const generateCurriculum = async (subject: string, updateStep?: (step: string) => void): Promise<Curriculum> => {
    const prompt = `
      You are Opal, an AI-powered Master Educator and Expert Technical Trainer.
      Your primary function is to transform a user-specified subject, especially complex hardware or software, into an exceptionally detailed, practical, multi-stage lesson program.
      Your goal is to guide a learner from a complete novice to a **professional-level user**, capable of utilizing all functions fluidly and expertly.
      The output must be professional, meticulously detailed, and structured for hands-on learning.
      The subject is: "${subject}".

      Generate a complete lesson program based on this subject. The output MUST be a valid JSON object that adheres to the provided schema.

      **CORE INSTRUCTIONS FOR HIGH-DETAIL CURRICULUM:**
      1.  **Deep Deconstruction**: For hardware like a keyboard controller, deconstruct it feature-by-feature. Cover physical controls (knobs, buttons, light guide), software integration (Komplete Kontrol software, DAW integration), and performance features (scales, arpeggiator, chords).
      2.  **Scaffolded, Practical Modules**: Determine the optimal number of modules required to take a learner from novice to expert. Do not use a fixed number. Create as many modules as are necessary to cover the subject comprehensively. Start with the absolute basics (e.g., unboxing, setup) and progressively move to advanced, creative workflows.
      3.  **Hyper-Detailed Module Content**: Each module's "content" section must be exhaustive.
          *   Use clear headings and subheadings within the Markdown.
          *   Break down every concept into **step-by-step instructions**. Assume the user is following along with the physical device.
          *   Explain not just **what** a button does, but **why** and **when** a user would use it in a real-world music production scenario.
          *   Include **'Pro-Tip'** or **'Workflow Example'** blockquotes to offer expert advice and context.
          *   The language should be that of an expert trainer teaching a masterclass.
      4.  **Action-Oriented Learning Objectives**: Learning objectives should be practical, e.g., "The user will be able to browse and load instruments directly from the S49 keyboard," not just "Understand the browser."
      5.  **Practical Assessments**:
          *   Quizzes (5-10 questions per module) and the Final Test (20-30 questions) must reflect this practical approach.
          *   Questions should test operational knowledge: "Which button activates Scale Mode?", "Describe the steps to map a parameter to a knob," "What visual feedback does the Light Guide provide for key splits?".
          *   Provide concise, accurate answers for all questions.

      **VIDEO INTEGRATION REQUIREMENTS:**
      -   For each module, include 2-3 recommended educational videos that supplement the learning.
      -   Videos should be from reputable educational sources (YouTube, Vimeo, Khan Academy, TED-Ed).
      -   Each video recommendation should include:
          -   A descriptive title that clearly indicates its educational value
          -   The platform (youtube, vimeo, khan-academy, ted-ed)
          -   A brief explanation of how the video relates to and enhances the module content
      -   Video recommendations should target different learning styles (visual demonstrations, theoretical explanations, practical applications).

      **EXAMPLE STRUCTURE FOR A MODULE ON THE 'BROWSER':**
      -   **Section 1: Accessing the Browser**
          -   Step 1: Press the BROWSE button on the S49.
          -   Step 2: Observe the onboard screens. What do you see?
          -   Explanation of the software counterpart.
      -   **Section 2: Navigating with Knobs and 4D Encoder**
          -   How to use the 8 knobs to filter by tags (Type, Mode, etc.).
          -   How to use the 4D encoder to scroll through presets and push to load.
          -   Pro-Tip: "Use the left/right arrows on the 4D encoder to jump between filter columns for faster navigation."
      -   **Section 3: Auditioning Sounds**
          -   Explanation of automatic sound previews as you scroll.
          -   How to adjust the preview volume.
    `;
    
    try {
        updateStep?.('🧠 Initializing AI curriculum generation...');
        
        updateStep?.('📝 Analyzing subject and structuring modules...');
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
                temperature: 0.7,
            },
        });

        const jsonText = response.text?.trim() || '';
        const curriculum = JSON.parse(jsonText) as Curriculum;
        
        updateStep?.('🎥 Enhancing curriculum with video recommendations...');
        
        // Enhance curriculum with actual video data
        const enhancedCurriculum = await enhanceCurriculumWithVideos(curriculum, updateStep);
        
        updateStep?.('✅ Curriculum generation completed with video integration!');
        
        return enhancedCurriculum;

    } catch (error) {
        console.error("Error generating curriculum from API:", error);
        throw new Error("Failed to parse curriculum from AI response.");
    }
};

/**
 * Enhance curriculum with actual video search results
 */
async function enhanceCurriculumWithVideos(curriculum: Curriculum, updateStep?: (step: string) => void): Promise<Curriculum> {
    try {
        console.log('🎥 Starting video enhancement for curriculum:', curriculum.subject);
        updateStep?.('🔍 Searching for educational videos...');
        
        // Global tracking to prevent video repeats across modules
        const globalUsedVideoIds = new Set<string>();
        console.log('🎯 Initialized global video deduplication system');
        
        // Process modules sequentially to ensure proper video deduplication
        const enhancedModules = [];
        
        for (let index = 0; index < curriculum.modules.length; index++) {
            const module = curriculum.modules[index];
            console.log(`🔍 Processing module ${module.moduleNumber}: ${module.title}`);
            console.log(`🚫 Currently excluded video IDs: ${globalUsedVideoIds.size}`);
            updateStep?.(`📹 Finding videos for Module ${module.moduleNumber}: ${module.title}`);
            
            // Create subject-focused search queries that always include the main subject
                const baseKeywords = curriculum.subject.toLowerCase();
                const moduleKeywords = module.title.toLowerCase();
                
                // Always ensure the main subject is prominently featured in searches
                const searchQueries = [
                    // Primary: Main subject + module context
                    `${baseKeywords} ${moduleKeywords.replace(/module \d+:?\s*/i, '')}`,
                    
                    // Secondary: Subject + educational keywords
                    `${baseKeywords} tutorial`,
                    `${baseKeywords} lesson`,
                    `learn ${baseKeywords}`,
                    `${baseKeywords} guide`,
                    
                    // Tertiary: Subject + level-based search
                    `${baseKeywords} ${module.moduleNumber === 1 ? 'beginner' : 
                       module.moduleNumber <= 3 ? 'basics' :
                       module.moduleNumber <= 6 ? 'intermediate' : 'advanced'}`,
                    
                    // Quaternary: Subject + common educational terms
                    `${baseKeywords} course`,
                    `${baseKeywords} introduction`,
                    `${baseKeywords} fundamentals`
                ].filter(query => query.length > 5); // Ensure all queries are reasonable length
                
                let allVideos: VideoResult[] = [];
                
                // Search for videos using multiple queries
                for (const query of searchQueries) {
                    try {
                        console.log(`🔍 Searching videos for: "${query}"`);
                        // Try YouTube first, fallback to PeerTube if quota exceeded
                        let videos = await videoSearchService.searchVideos(query, {
                            maxResults: 8,
                            minDuration: 60,
                            maxDuration: 2400,
                            platforms: ['youtube'],
                            educationalOnly: true
                        });
                        
                        // If YouTube returns no results (likely quota exceeded), try PeerTube
                        if (videos.length === 0) {
                            console.log(`🔄 YouTube failed for "${query}", trying PeerTube fallback...`);
                            videos = await videoSearchService.searchVideos(query, {
                                maxResults: 8,
                                minDuration: 60,
                                maxDuration: 2400,
                                platforms: ['peertube'],
                                educationalOnly: true
                            });
                        }
                        console.log(`📹 Found ${videos.length} videos for query: ${query}`);
                        if (videos.length > 0) {
                            console.log('Sample video:', videos[0]);
                        }
                        allVideos.push(...videos);
                    } catch (error) {
                        console.error(`❌ Failed to search videos for query: ${query}`, error);
                    }
                }
                
                // Remove duplicates and filter out globally used videos
                const uniqueVideos = allVideos.filter((video, index, self) => 
                    index === self.findIndex(v => v.id === video.id)
                );
                
                // Filter out videos that don't relate to the main subject
                const subjectRelevantVideos = uniqueVideos.filter(video => {
                    const title = video.title.toLowerCase();
                    const description = video.description.toLowerCase();
                    const mainSubject = curriculum.subject.toLowerCase();
                    
                    // Must contain main subject or have high relevance score
                    const hasSubjectInContent = title.includes(mainSubject) || description.includes(mainSubject);
                    const hasHighRelevance = video.relevanceScore >= 70;
                    
                    if (!hasSubjectInContent && !hasHighRelevance) {
                        console.log(`🚫 Excluding irrelevant video: "${video.title.substring(0, 50)}..." (score: ${video.relevanceScore})`);
                        return false;
                    }
                    return true;
                });
                
                // Filter out videos already used in previous modules
                const availableVideos = subjectRelevantVideos.filter(video => {
                    const isNotUsed = !globalUsedVideoIds.has(video.id);
                    if (!isNotUsed) {
                        console.log(`🚫 Skipping already used video: ${video.title.substring(0, 50)}...`);
                    }
                    return isNotUsed;
                });
                
                console.log(`📊 Module ${module.moduleNumber}: ${uniqueVideos.length} unique videos, ${subjectRelevantVideos.length} subject-relevant, ${availableVideos.length} available after deduplication`);
                
                // Sort available videos by relevance but also ensure diversity
                const sortedVideos = availableVideos.sort((a, b) => b.relevanceScore - a.relevanceScore);
                
                // Select videos with diversity in mind (different channels, durations, etc.)
                const selectedVideos = [];
                const usedChannels = new Set();
                
                // First pass: get highest relevance videos from different channels
                for (const video of sortedVideos) {
                    if (selectedVideos.length >= 4) break;
                    
                    if (!usedChannels.has(video.channelTitle) || usedChannels.size < 2) {
                        selectedVideos.push(video);
                        usedChannels.add(video.channelTitle);
                    }
                }
                
                // Second pass: fill remaining slots with best remaining videos
                for (const video of sortedVideos) {
                    if (selectedVideos.length >= 4) break;
                    if (!selectedVideos.some(v => v.id === video.id)) {
                        selectedVideos.push(video);
                    }
                }
                
                // If we don't have enough unique videos, try broader searches
                if (selectedVideos.length < 2 && module.moduleNumber > 5) {
                    console.log(`⚠️ Module ${module.moduleNumber}: Only ${selectedVideos.length} unique videos found, trying broader search...`);
                    
                    // Fallback: search with just the subject name, try both platforms
                    try {
                        let fallbackVideos = await videoSearchService.searchVideos(curriculum.subject, {
                            maxResults: 10,
                            minDuration: 60,
                            maxDuration: 3600,
                            platforms: ['youtube'],
                            educationalOnly: true
                        });
                        
                        // If YouTube still fails, try PeerTube for fallback too
                        if (fallbackVideos.length === 0) {
                            console.log(`🔄 Fallback: Trying PeerTube for subject "${curriculum.subject}"`);
                            fallbackVideos = await videoSearchService.searchVideos(curriculum.subject, {
                                maxResults: 10,
                                minDuration: 60,
                                maxDuration: 3600,
                                platforms: ['peertube'],
                                educationalOnly: true
                            });
                        }
                        
                        const availableFallback = fallbackVideos.filter(video => !globalUsedVideoIds.has(video.id));
                        const neededCount = 4 - selectedVideos.length;
                        const additionalVideos = availableFallback.slice(0, neededCount);
                        
                        selectedVideos.push(...additionalVideos);
                        console.log(`🔄 Added ${additionalVideos.length} fallback videos for Module ${module.moduleNumber}`);
                    } catch (error) {
                        console.warn(`Failed fallback search for Module ${module.moduleNumber}:`, error);
                    }
                }
                
                // Add selected video IDs to global tracking
                selectedVideos.forEach(video => {
                    globalUsedVideoIds.add(video.id);
                    console.log(`✅ Reserved video for Module ${module.moduleNumber}: ${video.title.substring(0, 50)}...`);
                });
                
                const topVideos = selectedVideos;
                
                // Convert to curriculum video format with specific descriptions
                const moduleVideos = topVideos.map((video, videoIndex) => {
                    const getModuleSpecificDescription = () => {
                        const qualityWord = video.relevanceScore >= 90 ? 'excellent' : 
                                          video.relevanceScore >= 80 ? 'comprehensive' : 
                                          video.relevanceScore >= 70 ? 'good' : 'helpful';
                        
                        // Module-specific context
                        const moduleContext = module.moduleNumber === 1 ? 'setup and initial configuration' :
                                            module.moduleNumber <= 3 ? 'basic operation and navigation' :
                                            module.moduleNumber <= 6 ? 'advanced features and customization' :
                                            'professional workflows and integration';
                        
                        const durationNote = video.durationSeconds < 300 ? ' (quick overview)' :
                                           video.durationSeconds > 1200 ? ' (detailed walkthrough)' : '';
                        
                        return `${qualityWord.charAt(0).toUpperCase() + qualityWord.slice(1)} ${video.platform} tutorial covering ${moduleContext} for this module${durationNote}.`;
                    };
                    
                    return {
                        title: video.title,
                        platform: video.platform,
                        relevanceDescription: getModuleSpecificDescription(),
                        // Store full video data for UI components (not in schema)
                        _videoData: video
                    };
                });
                
            console.log(`✅ Module ${module.moduleNumber} final videos:`, moduleVideos);
            
            enhancedModules.push({
                ...module,
                videos: moduleVideos
            });
        }
        
        console.log(`🎯 Global deduplication complete. Total unique videos used: ${globalUsedVideoIds.size}`);
        
        updateStep?.('✨ Video integration completed successfully!');
        
        return {
            ...curriculum,
            modules: enhancedModules
        };
        
    } catch (error) {
        console.warn('Failed to enhance curriculum with videos:', error);
        updateStep?.('⚠️ Continuing with curriculum without video enhancements...');
        
        // Return original curriculum with empty video arrays
        return {
            ...curriculum,
            modules: curriculum.modules.map(module => ({
                ...module,
                videos: []
            }))
        };
    }
}