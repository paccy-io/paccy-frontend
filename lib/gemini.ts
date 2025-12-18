// Gemini API integration for essay evaluation

export interface GeminiEvaluationResult {
  ai_score: number;
  ai_feedbacks: string[];
  ai_suggestion: string;
}

export interface GeminiEvaluationRequest {
  prompt: string;
  content: string;
}

/**
 * Evaluates an essay using Google's Gemini API
 * @param request The essay prompt and content
 * @param apiKey The Gemini API key (retrieved from localStorage)
 * @returns The evaluation result with score, feedbacks, and suggestion
 */
export async function evaluateEssayWithGemini(
  request: GeminiEvaluationRequest,
  apiKey: string
): Promise<GeminiEvaluationResult> {
  if (!apiKey || apiKey.trim() === "") {
    throw new Error(
      "Gemini API key is required. Please add your API key in Settings > Preferences."
    );
  }

  const evaluationPrompt = `You are a college essay evaluator. Evaluate the following essay based on the prompt and content provided.

Essay Prompt: ${request.prompt}

Essay Content: ${request.content}

Please evaluate this essay and provide your response in the following JSON format ONLY (no additional text):
{
  "ai_score": <number between 1-10>,
  "ai_feedbacks": ["feedback point 1", "feedback point 2", "..."],
  "ai_suggestion": "Overall improvement suggestion"
}

Evaluation Criteria:
- Relevance to prompt (1-10)
- Writing quality and clarity (1-10)
- Originality and creativity (1-10)
- Structure and organization (1-10)
- Grammar and mechanics (1-10)

IMPORTANT: Keep your response SHORT, CLEAR, and DIRECT.
- Provide exactly 3-4 specific feedback points (each under 15 words)
- Write ONE concise suggestion for improvement (under 25 words)
- Be direct and actionable - no fluff or unnecessary explanations`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemma-3-27b-it:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: evaluationPrompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 400) {
        throw new Error(
          "Invalid API key. Please check your Gemini API key in Settings."
        );
      }
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const data = await response.json();

    if (
      !data.candidates ||
      !data.candidates[0] ||
      !data.candidates[0].content ||
      !data.candidates[0].content.parts ||
      !data.candidates[0].content.parts[0]
    ) {
      throw new Error("Invalid response from Gemini API");
    }

    const generatedText = data.candidates[0].content.parts[0].text;

    // Extract JSON from the response (it might be wrapped in markdown code blocks)
    let jsonText = generatedText.trim();
    if (jsonText.startsWith("```json")) {
      jsonText = jsonText.replace(/^```json\n/, "").replace(/\n```$/, "");
    } else if (jsonText.startsWith("```")) {
      jsonText = jsonText.replace(/^```\n/, "").replace(/\n```$/, "");
    }

    const result: GeminiEvaluationResult = JSON.parse(jsonText);

    // Validate the response format
    if (
      typeof result.ai_score !== "number" ||
      !Array.isArray(result.ai_feedbacks) ||
      typeof result.ai_suggestion !== "string"
    ) {
      throw new Error("Invalid response format from Gemini API");
    }

    // Clamp score between 1-10
    result.ai_score = Math.max(1, Math.min(10, result.ai_score));

    return result;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(
        "Failed to parse AI response. Please try again or contact support."
      );
    }
    throw error;
  }
}

/**
 * Retrieves the Gemini API key from localStorage
 * @returns The API key or null if not found
 */
export function getGeminiApiKey(): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  return localStorage.getItem("gemini_api_key");
}
