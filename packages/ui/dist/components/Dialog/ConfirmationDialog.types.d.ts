import type { ComponentType } from 'svelte';
import type { ColorVariant } from '../../utils/index.js';
export interface ConfirmationDialogProps {
    /**
     * Controls the visibility of the dialog
     */
    open?: boolean;
    /**
     * Dialog title
     */
    title: string;
    /**
     * Dialog message (optional if using children snippet)
     */
    message?: string;
    /**
     * Lucide icon component to display
     */
    icon?: ComponentType;
    /**
     * Color variant for the icon
     * @default 'danger'
     */
    iconColor?: ColorVariant;
    /**
     * Label for the confirm button
     * @default 'Confirm'
     */
    confirmLabel?: string;
    /**
     * Color variant for the confirm button
     * @default 'danger'
     */
    confirmColor?: ColorVariant;
    /**
     * Label for the cancel button
     * @default 'Cancel'
     */
    cancelLabel?: string;
    /**
     * Loading state for the confirm button
     */
    loading?: boolean;
    /**
     * Callback when confirm button is clicked
     * Can be async
     */
    onConfirm: () => void | Promise<void>;
    /**
     * Callback when cancel button is clicked or backdrop is clicked
     */
    onCancel: () => void;
    /**
     * Close dialog when clicking the backdrop
     * @default true
     */
    closeOnBackdropClick?: boolean;
    /**
     * Close dialog when pressing Escape key
     * @default true
     */
    closeOnEscape?: boolean;
    /**
     * Custom CSS classes
     */
    class?: string;
}
