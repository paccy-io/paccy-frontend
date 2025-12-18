# AI-Powered Essay Evaluator

## Overview

The AI-powered essay evaluator uses Google's Gemini API to provide intelligent feedback on college essays. The feature analyzes essays based on multiple criteria and provides actionable suggestions for improvement.

## Setup Instructions

### 1. Get a Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

### 2. Add API Key to Paccy

1. Navigate to **Settings** > **Preferences** tab
2. Scroll down to the "Gemini API Key" section
3. Paste your API key in the input field
4. Click "Save API Key"

**Note**: Your API key is stored locally in your browser only and is never sent to Paccy's backend servers.

## How to Use

### Evaluate an Essay

1. Navigate to any essay in **Dashboard** > **Essays** > Select an essay
2. Write your essay content and prompt
3. Click the **"Evaluate"** button in the Statistics sidebar
4. Wait for the AI to analyze your essay (usually takes 5-10 seconds)
5. View the results in the AI Evaluation section

### Understanding the Results

#### AI Score (1-10)

- **8-10**: Excellent essay with strong content and structure
- **6-7**: Good essay that needs minor improvements
- **1-5**: Essay needs significant revisions

#### AI Feedback

- Multiple specific feedback points on different aspects of your essay
- Covers relevance to prompt, writing quality, originality, structure, and grammar

#### AI Suggestion

- Comprehensive recommendation for overall improvement
- Actionable steps to enhance your essay

## Evaluation Criteria

The AI evaluates essays based on:

1. **Relevance to Prompt** (1-10): How well the essay addresses the given prompt
2. **Writing Quality & Clarity** (1-10): Readability, clarity, and flow
3. **Originality & Creativity** (1-10): Unique perspective and creative expression
4. **Structure & Organization** (1-10): Logical flow and paragraph structure
5. **Grammar & Mechanics** (1-10): Proper grammar, spelling, and punctuation

## Technical Details

### Implementation

- **API**: Google Gemini Pro model
- **Storage**: API key stored in browser localStorage only
- **Security**: API key never sent to backend, all requests made directly from browser to Google
- **Data**: Essay evaluation results (score, feedbacks, suggestion) are saved to your Paccy account

### Files Modified/Created

- `/lib/gemini.ts` - Gemini API integration utility
- `/app/dashboard/essays/[id]/page.tsx` - Essay editor with AI evaluation
- `/app/dashboard/settings/page.tsx` - API key management in settings

### API Response Format

```json
{
  "ai_score": 8,
  "ai_feedbacks": [
    "Strong opening that immediately captures attention",
    "Good use of specific examples to support main points",
    "Consider adding more personal reflection in the conclusion"
  ],
  "ai_suggestion": "Overall, this is a compelling essay. To make it even stronger, focus on connecting your experiences more explicitly to your future goals and how they align with the college's values."
}
```

## Troubleshooting

### "Gemini API key not found" Error

- Solution: Go to Settings > Preferences and add your Gemini API key

### "Invalid API key" Error

- Solution: Verify your API key is correct in Settings > Preferences
- Generate a new key from [Google AI Studio](https://aistudio.google.com/app/apikey)

### "Please write some content before evaluating" Error

- Solution: Make sure you have written essay content and added a prompt

### Evaluation Takes Too Long

- The evaluation typically takes 5-10 seconds
- If it takes longer than 30 seconds, check your internet connection
- Try clicking "Evaluate" again

### API Key Security

- Your API key is stored only in your browser's localStorage
- It is never sent to Paccy's backend servers
- You can delete your API key anytime from Settings > Preferences
- Clear your browser data to remove the stored API key

## Deleting Your API Key

1. Go to **Settings** > **Preferences** tab
2. Scroll to "Gemini API Key" section
3. Click "Delete API Key"
4. Confirm deletion

## Limitations

- Requires a valid Gemini API key
- Essay must have both content and prompt to be evaluated
- Rate limits apply based on your Gemini API quota
- Internet connection required for evaluation
