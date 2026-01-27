import { ANTHROPIC_API_KEY } from '$env/static/private';
import type { MathDifficulty, MathOperation, MathProblem } from '@educational-app/learning';
import { generateProblems, getDifficultyRange } from '@educational-app/learning';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const prerender = false;

interface GenerateRequest {
	count: number;
	difficulty: MathDifficulty;
	includeZehneruebergang: boolean;
	operations?: MathOperation[];
}

interface ClaudeMessage {
	role: 'user' | 'assistant';
	content: string;
}

interface ClaudeResponse {
	content: Array<{ type: string; text?: string }>;
	stop_reason: string;
	usage: { input_tokens: number; output_tokens: number };
}

/**
 * Generate math problems endpoint
 * Uses Claude API for intelligent problem generation with local fallback
 */
export const POST: RequestHandler = async ({ request }) => {
	try {
		const body: GenerateRequest = await request.json();
		const { count, difficulty, includeZehneruebergang, operations } = body;

		// Validate input
		if (!count || count < 1 || count > 20) {
			return json({ error: 'Count must be between 1 and 20' }, { status: 400 });
		}

		if (!['easy', 'medium', 'hard'].includes(difficulty)) {
			return json({ error: 'Invalid difficulty level' }, { status: 400 });
		}

		// Try Claude API first if available
		if (ANTHROPIC_API_KEY) {
			try {
				const problems = await generateProblemsWithClaude({
					count,
					difficulty,
					includeZehneruebergang,
					operations
				});

				if (problems && problems.length > 0) {
					return json({ problems, source: 'claude' });
				}
			} catch (apiError) {
				console.warn('Claude API failed, falling back to local generation:', apiError);
			}
		}

		// Fallback to local generation
		const problems = generateProblems({
			count,
			difficulty,
			includeZehneruebergang,
			operations
		});

		return json({ problems, source: 'local' });
	} catch (err) {
		console.error('Error generating problems:', err);
		return json({ error: 'Failed to generate problems' }, { status: 500 });
	}
};

/**
 * Generate problems using Claude API
 */
async function generateProblemsWithClaude(config: GenerateRequest): Promise<MathProblem[]> {
	const { count, difficulty, includeZehneruebergang, operations = ['addition', 'subtraction'] } = config;
	const range = getDifficultyRange(difficulty);

	const prompt = `Generate ${count} German elementary math problems for 6-8 year old children learning basic arithmetic.

Requirements:
- Number range: ${range.min} to ${range.max}
- Operations: ${operations.join(' and ')}
- Include Zehnerübergang (crossing tens): ${includeZehneruebergang ? 'Yes, include some problems' : 'No, avoid crossing tens'}
- Problem types should rotate between:
  - "__ + b = c" (find left operand)
  - "a + __ = c" (find right operand)
  - "a + b = __" (find result)
  - Same for subtraction

For each problem, determine if it has Zehnerübergang:
- Addition: if the ones digits sum to 10 or more (e.g., 7 + 5 crosses tens)
- Subtraction: if you need to borrow from tens (e.g., 13 - 5 crosses tens)

Return ONLY a valid JSON array with this exact structure (no markdown, no explanation):
[
  {
    "id": "unique-id-string",
    "type": "addition_result",
    "operation": "addition",
    "display": "5 + 7 = __",
    "leftOperand": 5,
    "rightOperand": 7,
    "result": 12,
    "unknownPosition": "result",
    "correctAnswer": 12,
    "hasZehneruebergang": true,
    "difficulty": "${difficulty}"
  }
]

Valid types: addition_left, addition_right, addition_result, subtraction_left, subtraction_right, subtraction_result
Valid unknownPosition: left, right, result

Generate exactly ${count} problems with varied types.`;

	const messages: ClaudeMessage[] = [{ role: 'user', content: prompt }];

	const response = await fetch('https://api.anthropic.com/v1/messages', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'x-api-key': ANTHROPIC_API_KEY,
			'anthropic-version': '2023-06-01'
		},
		body: JSON.stringify({
			model: 'claude-3-5-haiku-20241022',
			max_tokens: 2000,
			messages
		})
	});

	if (!response.ok) {
		const errorText = await response.text();
		console.error('Claude API error:', response.status, errorText);
		throw new Error(`Claude API error: ${response.status}`);
	}

	const data: ClaudeResponse = await response.json();
	const content = data.content?.find(c => c.type === 'text')?.text;

	if (!content) {
		throw new Error('No content in Claude response');
	}

	// Parse JSON from response (handle potential markdown code blocks)
	let jsonContent = content.trim();
	if (jsonContent.startsWith('```')) {
		jsonContent = jsonContent.replace(/```json?\n?/g, '').replace(/```$/g, '').trim();
	}

	const problems: MathProblem[] = JSON.parse(jsonContent);

	// Validate and ensure all problems have required fields
	return problems.map((p, index) => ({
		id: p.id || `claude-${Date.now()}-${index}`,
		type: p.type,
		operation: p.operation,
		display: p.display,
		leftOperand: p.leftOperand,
		rightOperand: p.rightOperand,
		result: p.result,
		unknownPosition: p.unknownPosition,
		correctAnswer: p.correctAnswer,
		hasZehneruebergang: p.hasZehneruebergang,
		difficulty: p.difficulty || difficulty
	}));
}
