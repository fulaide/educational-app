/**
 * Drawer Components Export
 * Versatile drawer/panel component with swipe gestures and multi-directional support
 */

// Main Drawer component
export { default as Drawer } from './Drawer.svelte';

// Modular drawer components
export { default as DrawerHeader } from './DrawerHeader.svelte';
export { default as DrawerFooter } from './DrawerFooter.svelte';

// TypeScript definitions
export type {
  DrawerProps,
  DrawerHeaderProps,
  DrawerPosition,
  DrawerSize,
  SwipeDirection,
  TouchEventData,
  SwipeGestureConfig,
  DrawerAnimationState,
  DrawerSection,
  DrawerSizeConfig
} from './Drawer.types.js';