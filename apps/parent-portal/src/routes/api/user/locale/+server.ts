import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '@educational-app/database';
import { SUPPORTED_LOCALES } from '@educational-app/i18n';

export const POST: RequestHandler = async ({ request, locals }) => {
	// Check if user is authenticated
	if (!locals.user) {
		return json({ error: 'Not authenticated' }, { status: 401 });
	}

	try {
		const { locale } = await request.json();

		// Validate locale
		if (!locale || !SUPPORTED_LOCALES.includes(locale)) {
			return json({ error: 'Invalid locale' }, { status: 400 });
		}

		// Update user's locale in database settings
		const currentSettings = await prisma.user.findUnique({
			where: { id: locals.user.id },
			select: { settings: true }
		});

		const updatedSettings = {
			...(currentSettings?.settings as object || {}),
			locale
		};

		await prisma.user.update({
			where: { id: locals.user.id },
			data: { settings: updatedSettings }
		});

		console.log(`[LOCALE API] Updated user ${locals.user.email} locale to: ${locale}`);

		return json({ success: true, locale });
	} catch (error) {
		console.error('[LOCALE API] Error updating user locale:', error);
		return json({ error: 'Failed to update locale' }, { status: 500 });
	}
};