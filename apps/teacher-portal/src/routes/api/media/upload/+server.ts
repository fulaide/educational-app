import { json, error } from '@sveltejs/kit';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import type { RequestHandler } from './$types';
import { requireRole } from '$lib/auth/auth-helpers.server';
import { dev } from '$app/environment';

/**
 * Handle image uploads - development mode with local storage
 * In production, this would use Vercel Blob storage
 */
export const POST: RequestHandler = async ({ request, locals, cookies }) => {
  try {
    console.log('[UPLOAD] Starting upload, locals.user:', locals.user);
    console.log('[UPLOAD] Session cookie:', cookies.get('session'));
    
    // Require authenticated user (teacher for now)
    const session = await requireRole(locals, 'TEACHER');
    
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = (formData.get('folder') as string) || 'class-avatars';
    
    if (!file) {
      return error(400, 'No file provided');
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return error(400, 'Invalid file type. Only JPEG, PNG, and WebP files are allowed.');
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return error(400, `File size exceeds maximum allowed size of ${maxSize / (1024 * 1024)}MB`);
    }

    // Validate category
    const allowedCategories = ['class-avatars', 'reward-images', 'student-profiles', 'achievements'];
    if (!allowedCategories.includes(folder)) {
      return error(400, `Invalid category: ${folder}`);
    }

    // Generate unique filename
    const timestamp = Date.now();
    const extension = file.name.split('.').pop() || 'jpg';
    const filename = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

    if (dev) {
      // Development mode - store files locally in static/uploads
      const uploadsDir = join(process.cwd(), 'static', 'uploads', folder);
      
      // Ensure directory exists
      if (!existsSync(uploadsDir)) {
        await mkdir(uploadsDir, { recursive: true });
      }

      // Write file to local storage
      const filePath = join(uploadsDir, filename);
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      await writeFile(filePath, buffer);
      
      console.log('Upload completed (dev):', {
        filename,
        size: file.size,
        category: folder,
        userId: session.user.id
      });

      // Return local URL for development
      return json({
        url: `/uploads/${folder}/${filename}`,
        type: 'custom',
        size: file.size,
        filename
      });
    } else {
      // Production mode would use Vercel Blob here
      return error(501, 'Production upload not implemented yet. Please set up Vercel Blob.');
    }

  } catch (err) {
    console.error('Upload error:', err);
    
    if (err instanceof Error) {
      if (err.message.includes('Invalid category') || err.message.includes('Invalid file')) {
        return error(400, err.message);
      }
      if (err.message.includes('Unauthorized') || err.message.includes('role')) {
        return error(401, 'Unauthorized');
      }
      if (err.message.includes('size') || err.message.includes('type')) {
        return error(400, err.message);
      }
    }

    return error(500, 'Upload failed. Please try again.');
  }
};