import Anthropic from '@anthropic-ai/sdk';
import { ANTHROPIC_API_KEY } from '$env/static/private';
import type { GermanFeedback, MathProblem } from '@educational-app/learning';
import { generateLocalFeedback } from '@educational-app/learning';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const prerender = false;

interface EvaluateRequest {
	problem: MathProblem;
	userAnswer: number;
}

// Initialize Anthropic client
const anthropic = ANTHROPIC_API_KEY ? new Anthropic({ apiKey: ANTHROPIC_API_KEY }) : null;

/**
 * Evaluate math answer endpoint
 * Uses Claude API for intelligent German feedback with local fallback
 */
export const POST: RequestHandler = async ({ request }) => {
	try {
		const body: EvaluateRequest = await request.json();
		const { problem, userAnswer } = body;

		// Validate input
		if (!problem || typeof userAnswer !== 'number') {
			return json({ error: 'Invalid request: problem and userAnswer required' }, { status: 400 });
		}

		const isCorrect = userAnswer === problem.correctAnswer;

		// Try Claude API first if available
		if (anthropic) {
			try {
				const feedback = await generateFeedbackWithClaude(problem, userAnswer, isCorrect);
				if (feedback) {
					return json({ ...feedback, source: 'claude' });
				}
			} catch (apiError) {
				console.warn('Claude API failed, falling back to local feedback:', apiError);
			}
		}

		// Fallback to local feedback generation
		const feedback = generateLocalFeedback(problem, userAnswer);
		return json({ ...feedback, source: 'local' });
	} catch (err) {
		console.error('Error evaluating answer:', err);
		return json({ error: 'Failed to evaluate answer' }, { status: 500 });
	}
};

/**
 * Generate feedback using Claude API
 */
async function generateFeedbackWithClaude(
	problem: MathProblem,
	userAnswer: number,
	isCorrect: boolean
): Promise<GermanFeedback> {
	if (!anthropic) throw new Error('Anthropic client not initialized');

	const prompt = `You are a kind and encouraging German elementary school math teacher helping a 6-8 year old student.

The student answered a math problem:
- Problem: ${problem.display}
- Student's answer: ${userAnswer}
- Correct answer: ${problem.correctAnswer}
- The answer is: ${isCorrect ? 'CORRECT' : 'INCORRECT'}
- This problem ${problem.hasZehneruebergang ? 'involves' : 'does not involve'} Zehnerübergang (crossing tens)

${isCorrect ? `
Generate an enthusiastic, short praise message in German. Use phrases like:
- "Gut gemacht!"
- "Prima!"
- "Super!"
- "Richtig!"
- "Toll gemacht!"
- "Sehr gut!"

If it involved Zehnerübergang, briefly acknowledge that the student mastered this harder concept.
` : `
Generate a gentle, encouraging response in German that:
1. Starts with a kind phrase like "Nicht ganz richtig." or "Fast richtig!"
2. Provides a clear step-by-step explanation appropriate for a 6-8 year old

${problem.hasZehneruebergang ? `
Since this involves Zehnerübergang, use the "Verliebte Zahlen" (number bonds to 10) method:
- Explain which number needs how much to reach 10
- Show the split: first to 10, then add/subtract the rest
- Example for 7 + 5: "7 braucht noch 3 bis zur 10. 7 + 3 = 10, dann noch 2 dazu: 10 + 2 = 12"
` : `
Give a simple, direct explanation of the correct calculation.
`}

Keep the explanation to 2-3 sentences maximum. Use simple German words.
`}

Return ONLY a valid JSON object with this exact structure (no markdown, no explanation):
{
  "isCorrect": ${isCorrect},
  "message": "The main praise or encouragement phrase",
  "explanation": "The detailed explanation (only for incorrect answers, null for correct)"
}`;

	const message = await anthropic.messages.create({
		model: 'claude-sonnet-4-20250514',
		max_tokens: 500,
		messages: [{ role: 'user', content: prompt }]
	});

	const content = message.content[0];
	if (content.type !== 'text') {
		throw new Error('Unexpected response type');
	}

	// Parse JSON from response
	let jsonContent = content.text.trim();
	if (jsonContent.startsWith('```')) {
		jsonContent = jsonContent.replace(/```json?\n?/g, '').replace(/```$/g, '').trim();
	}

	const feedback: GermanFeedback = JSON.parse(jsonContent);

	return {
		isCorrect: feedback.isCorrect,
		message: feedback.message,
		explanation: feedback.explanation || undefined
	};
}
