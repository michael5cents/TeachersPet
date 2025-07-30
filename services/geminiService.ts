import { GoogleGenAI, Type } from "@google/genai";
import type { Curriculum } from '../types';

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


export const generateCurriculum = async (subject: string): Promise<Curriculum> => {
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
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
                temperature: 0.7,
            },
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as Curriculum;

    } catch (error) {
        console.error("Error generating curriculum from API:", error);
        throw new Error("Failed to parse curriculum from AI response.");
    }
};