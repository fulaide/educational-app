/**
 * Drawer Component Types
 * TypeScript definitions for the versatile drawer/panel component
 */
import type { NavigationItem } from '../AppLayout/AppLayout.types.js';
export interface DrawerProps {
    /**
     * Whether the drawer is open
     */
    isOpen?: boolean;
    /**
     * Position of the drawer
     */
    position?: 'left' | 'right' | 'top' | 'bottom';
    /**
     * Size of the drawer
     */
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
    /**
     * Custom width/height (overrides size)
     */
    width?: string;
    height?: string;
    /**
     * Whether to show backdrop overlay
     */
    showBackdrop?: boolean;
    /**
     * Whether backdrop click closes drawer
     */
    closeOnBackdropClick?: boolean;
    /**
     * Whether ESC key closes drawer
     */
    closeOnEscape?: boolean;
    /**
     * Enable swipe gestures to open/close
     */
    enableSwipeGestures?: boolean;
    /**
     * Swipe threshold distance (px)
     */
    swipeThreshold?: number;
    /**
     * Swipe velocity threshold
     */
    swipeVelocity?: number;
    /**
     * Whether to blur backdrop
     */
    blurBackdrop?: boolean;
    /**
     * Custom CSS class
     */
    class?: string;
    /**
     * Drawer title
     */
    title?: string;
    /**
     * Whether to show close button
     */
    showCloseButton?: boolean;
    /**
     * Header actions
     */
    headerActions?: NavigationItem[];
    /**
     * Whether drawer is persistent (can't be closed by user)
     */
    persistent?: boolean;
    /**
     * Z-index value
     */
    zIndex?: number;
    /**
     * Animation duration (ms)
     */
    animationDuration?: number;
    /**
     * Animation easing function
     */
    animationEasing?: string;
    /**
     * Callback when drawer opens
     */
    onOpen?: () => void;
    /**
     * Callback when drawer closes
     */
    onClose?: () => void;
    /**
     * Callback when drawer animation completes
     */
    onAnimationComplete?: (isOpen: boolean) => void;
    /**
     * Callback for swipe events
     */
    onSwipe?: (direction: SwipeDirection, progress: number) => void;
}
export interface DrawerHeaderProps {
    /**
     * Drawer title
     */
    title?: string;
    /**
     * Whether to show close button
     */
    showCloseButton?: boolean;
    /**
     * Close button click handler
     */
    onClose?: () => void;
    /**
     * Header actions
     */
    actions?: NavigationItem[];
    /**
     * Custom CSS class
     */
    class?: string;
}
export type DrawerPosition = 'left' | 'right' | 'top' | 'bottom';
export type DrawerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';
export type SwipeDirection = 'up' | 'down' | 'left' | 'right';
export interface TouchEventData {
    startX: number;
    startY: number;
    currentX: number;
    currentY: number;
    startTime: number;
    element: HTMLElement;
}
export interface SwipeGestureConfig {
    threshold: number;
    velocity: number;
    direction: SwipeDirection[];
    element: HTMLElement;
    onSwipeStart?: (data: TouchEventData) => void;
    onSwipeMove?: (data: TouchEventData, progress: number) => void;
    onSwipeEnd?: (data: TouchEventData, direction?: SwipeDirection) => void;
}
export type DrawerAnimationState = 'closed' | 'opening' | 'open' | 'closing';
export interface DrawerSection {
    id: string;
    title?: string;
    description?: string;
    className?: string;
    children?: any;
}
export interface DrawerSizeConfig {
    horizontal: {
        sm: string;
        md: string;
        lg: string;
        xl: string;
        full: string;
    };
    vertical: {
        sm: string;
        md: string;
        lg: string;
        xl: string;
        full: string;
    };
}
