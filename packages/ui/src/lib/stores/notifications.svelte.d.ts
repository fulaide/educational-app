import type { Notification, NotificationOptions, NotificationType, NotificationConfig } from '../types/notifications.js';
export declare class NotificationManager {
    notifications: Notification[];
    private config;
    constructor(config?: Partial<NotificationConfig>);
    /**
     * Add a new notification
     */
    add(options: NotificationOptions): string;
    /**
     * Remove a notification by ID
     */
    remove(id: string): void;
    /**
     * Clear all notifications
     */
    clear(): void;
    /**
     * Clear non-persistent notifications only
     */
    clearNonPersistent(): void;
    /**
     * Update a notification
     */
    update(id: string, updates: Partial<NotificationOptions>): boolean;
    /**
     * Check if a notification exists
     */
    exists(id: string): boolean;
    /**
     * Get notification count by type
     */
    getCountByType(type: NotificationType): number;
    success(message: string, options?: Partial<NotificationOptions>): string;
    error(message: string, options?: Partial<NotificationOptions>): string;
    warning(message: string, options?: Partial<NotificationOptions>): string;
    info(message: string, options?: Partial<NotificationOptions>): string;
    /**
     * Show a loading notification that can be updated
     */
    loading(message: string, options?: Partial<NotificationOptions>): string;
    /**
     * Convert loading notification to success/error
     */
    resolveLoading(id: string, success: boolean, message: string): boolean;
    private getDefaultDuration;
}
export declare function createNotificationContext(config?: Partial<NotificationConfig>): NotificationManager;
export declare function getNotificationContext(): NotificationManager;
export declare function useNotifications(): NotificationManager;
