import type { PresetImage, ImageCategory } from '../types.js';

/**
 * Preset image catalog management
 */

export const CLASS_AVATAR_PRESETS: PresetImage[] = [
  // Animals
  {
    id: 'owl-classroom',
    url: '/assets/class-avatars/owl-classroom.svg',
    category: 'class-avatars',
    alt: 'Wise owl with graduation cap',
    tags: ['animal', 'wise', 'education', 'popular']
  },
  {
    id: 'bear-reading',
    url: '/assets/class-avatars/bear-reading.svg',
    category: 'class-avatars',
    alt: 'Friendly bear reading a book',
    tags: ['animal', 'reading', 'friendly', 'popular']
  },
  
  // School Objects
  {
    id: 'colorful-pencils',
    url: '/assets/class-avatars/colorful-pencils.svg',
    category: 'class-avatars',
    alt: 'Bundle of colorful pencils',
    tags: ['school', 'creative', 'colorful', 'writing', 'popular']
  },
  {
    id: 'open-book',
    url: '/assets/class-avatars/open-book.svg',
    category: 'class-avatars',
    alt: 'Open book with golden pages',
    tags: ['school', 'reading', 'knowledge', 'popular']
  },

  // Abstract & Geometric
  {
    id: 'rainbow-circle',
    url: '/assets/class-avatars/rainbow-circle.svg',
    category: 'class-avatars',
    alt: 'Colorful rainbow circle',
    tags: ['abstract', 'colorful', 'rainbow', 'positive', 'popular']
  },
  {
    id: 'star-burst',
    url: '/assets/class-avatars/star-burst.svg',
    category: 'class-avatars',
    alt: 'Golden star with burst effect',
    tags: ['abstract', 'achievement', 'success', 'motivational']
  }
];

export const REWARD_IMAGE_PRESETS: PresetImage[] = [
  // Achievement badges
  {
    id: 'gold-star',
    url: '/assets/reward-images/gold-star.webp',
    category: 'reward-images',
    alt: 'Shiny gold star',
    tags: ['achievement', 'star', 'gold', 'popular']
  },
  {
    id: 'trophy-winner',
    url: '/assets/reward-images/trophy-winner.webp',
    category: 'reward-images',
    alt: 'Winner trophy cup',
    tags: ['achievement', 'trophy', 'winner', 'success']
  },
  {
    id: 'medal-honor',
    url: '/assets/reward-images/medal-honor.webp',
    category: 'reward-images',
    alt: 'Honor medal with ribbon',
    tags: ['achievement', 'medal', 'honor', 'recognition']
  },

  // Fun rewards
  {
    id: 'ice-cream-treat',
    url: '/assets/reward-images/ice-cream-treat.webp',
    category: 'reward-images',
    alt: 'Colorful ice cream cone',
    tags: ['treat', 'fun', 'sweet', 'popular']
  },
  {
    id: 'playground-fun',
    url: '/assets/reward-images/playground-fun.webp',
    category: 'reward-images',
    alt: 'Fun playground equipment',
    tags: ['fun', 'play', 'active', 'outdoor']
  }
];

/**
 * Get preset images by category
 */
export function getPresetImages(category: ImageCategory): PresetImage[] {
  switch (category) {
    case 'class-avatars':
      return CLASS_AVATAR_PRESETS;
    case 'reward-images':
      return REWARD_IMAGE_PRESETS;
    case 'student-profiles':
    case 'achievements':
      return []; // To be implemented later
    default:
      return [];
  }
}

/**
 * Get preset images by tags
 */
export function getPresetImagesByTags(
  category: ImageCategory, 
  tags: string[]
): PresetImage[] {
  const presets = getPresetImages(category);
  if (tags.length === 0) return presets;
  
  return presets.filter(preset =>
    tags.some(tag => preset.tags.includes(tag))
  );
}

/**
 * Get popular preset images
 */
export function getPopularPresetImages(category: ImageCategory): PresetImage[] {
  return getPresetImagesByTags(category, ['popular']);
}

/**
 * Search preset images by name or alt text
 */
export function searchPresetImages(
  category: ImageCategory,
  query: string
): PresetImage[] {
  const presets = getPresetImages(category);
  const lowerQuery = query.toLowerCase();
  
  return presets.filter(preset =>
    preset.alt.toLowerCase().includes(lowerQuery) ||
    preset.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}