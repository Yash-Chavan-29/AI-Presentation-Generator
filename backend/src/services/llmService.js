const { GoogleGenAI, Type } = require('@google/genai');

/**
 * LLM Service to interact with the Gemini API.
 * Uses official @google/genai SDK with Structured JSON Outputs.
 * Automatically falls back to high-quality mock data if API key is invalid or call fails.
 */
const generateAIContent = async (prompt, code) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    console.warn('[LLM Service] No active Gemini API key found. Using mock content.');
    return getMockContent(prompt, code);
  }

  console.log('[LLM Service] Initiating structured Gemini API call...');
  try {
    const ai = new GoogleGenAI({ apiKey });
    
    // Detailed instructional prompt for the LLM
    const systemPrompt = `
You are an expert AI code presentation architect.
Your task is to analyze the user's prompt and optional code context, and return a structured JSON response representing:
1. An explanation (written technical summary of the presentation, using markdown formatting).
2. A slide deck (an array of slides explaining the concepts and/or reviewing the code).

USER REQUEST:
"${prompt}"

${code ? `USER CODE CONTEXT:\n\`\`\`\n${code}\n\`\`\`` : 'No source code context provided.'}

Requirements for the slide deck items:
- Deliver exactly 4 slides.
- Each slide must have a 'title', 'bulletPoints' (2-4 clear sentences summarizing a key point), and a 'codeSnippet' (short code script, config file, or pseudocode demonstrating the slide's topic).
- If code context is provided, slice and reference relevant blocks of that code across the slides. If not, generate educational snippets matching the theme.
`;

    // Make the API call to Gemini 2.5 Flash
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: systemPrompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            explanation: { 
              type: Type.STRING, 
              description: "A technical markdown text summary explaining the topic and key takeaways."
            },
            slides: {
              type: Type.ARRAY,
              description: "Array of slide objects for the presentation layout.",
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.INTEGER },
                  title: { type: Type.STRING },
                  bulletPoints: { 
                    type: Type.ARRAY, 
                    items: { type: Type.STRING } 
                  },
                  codeSnippet: { 
                    type: Type.STRING, 
                    description: "Stylized source code snippet showing implementation or setup examples."
                  }
                },
                required: ['id', 'title', 'bulletPoints', 'codeSnippet']
              }
            }
          },
          required: ['explanation', 'slides']
        }
      }
    });

    // Parse the JSON response
    const jsonOutput = JSON.parse(response.text);
    console.log('[LLM Service] Successfully generated slides via Gemini API.');
    return jsonOutput;

  } catch (error) {
    console.error('[LLM Service] Live API request failed. Falling back to mock generator. Error:', error.message);
    return getMockContent(prompt, code);
  }
};

/**
 * Graceful fallback mock generator.
 */
const getMockContent = (prompt, code) => {
  const topicTitle = prompt.length > 30 ? prompt.substring(0, 30) + '...' : prompt;
  const codeSnippet = code || `// Sample Code\nfunction greet() {\n  console.log("Welcome to AI Presentation Generator");\n}`;

  return {
    explanation: `This presentation covers the key aspects of **"${prompt}"** with deep technical insights.\n\n### Key Takeaways:\n1. **Structured Automation**: AI-driven generators speed up developer workflows.\n2. **Clean Architecture**: Separating presentation data from layout layers guarantees modularity.\n3. **Tailored Explanations**: Presenting snippets side-by-side with bullet points dramatically improves comprehension.\n\n*Below you will find the slide deck outline compiled for PPTX & PDF export.*`,
    slides: [
      {
        id: 1,
        title: topicTitle,
        bulletPoints: [
          'Interactive tool for generating slides directly from source code and text prompts',
          'Speeds up engineering presentations, sprint demos, and training sessions',
          'Powered by Gemini Structured Outputs'
        ],
        codeSnippet: '// Main Entrypoint\nconsole.log("AI Slide Builder initialized!");'
      },
      {
        id: 2,
        title: 'Analyzing Source Code',
        bulletPoints: [
          'Accepts user-supplied scripts in JavaScript, Python, C++, etc.',
          'AI breaks down functions, classes, and logic blocks',
          'Generates succinct summaries for code walk-throughs'
        ],
        codeSnippet: codeSnippet
      },
      {
        id: 3,
        title: 'Architecture & Design System',
        bulletPoints: [
          'Frontend built with React, Tailwind CSS, and Lucide React Icons',
          'Express backend manages Puppeteer/Marp PDF compilation and PPTXGenJS formatting',
          'Enables serverless integrations or full-scale VPS deployments'
        ],
        codeSnippet: 'const express = require("express");\nconst app = express();\napp.use("/api", router);'
      },
      {
        id: 4,
        title: 'Key Benefits & Next Steps',
        bulletPoints: [
          'Automated exports save developers hours of manual formatting',
          'Perfect alignment of code snippets and bulleted descriptions',
          'Extendable template configurations for team layouts'
        ],
        codeSnippet: '// Export configuration\nmodule.exports = { theme: "glassmorphism", mode: "dark" };'
      }
    ]
  };
};

module.exports = {
  generateAIContent
};
