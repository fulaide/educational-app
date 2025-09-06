import { getContext, setContext } from 'svelte';
export class NotificationManager {
    notifications = $state([]);
    config = {
        defaultDuration: {
            success: 3000,
            error: 5000,
            warning: 4000,
            info: 3000
        },
        maxNotifications: 5,
        enableSounds: false,
        enableAnimations: true
    };
    constructor(config) {
        if (config) {
            this.config = { ...this.config, ...config };
        }
    }
    /**
     * Add a new notification
     */
    add(options) {
        const notification = {
            id: options.id || crypto.randomUUID(),
            title: options.title || '',
            message: options.message,
            type: options.type,
            duration: options.duration ?? this.getDefaultDuration(options.type),
            actions: options.actions || [],
            persistent: options.persistent ?? false,
            createdAt: Date.now(),
            icon: options.icon
        };
        // Remove oldest notifications if exceeding limit
        while (this.notifications.length >= this.config.maxNotifications) {
            const oldest = this.notifications.find(n => !n.persistent);
            if (oldest) {
                this.remove(oldest.id);
            }
            else {
                break; // All notifications are persistent
            }
        }
        this.notifications.push(notification);
        // Auto-dismiss non-persistent notifications
        if (!notification.persistent && notification.duration > 0) {
            setTimeout(() => this.remove(notification.id), notification.duration);
        }
        return notification.id;
    }
    /**
     * Remove a notification by ID
     */
    remove(id) {
        const index = this.notifications.findIndex(n => n.id === id);
        if (index > -1) {
            this.notifications.splice(index, 1);
        }
    }
    /**
     * Clear all notifications
     */
    clear() {
        this.notifications.length = 0;
    }
    /**
     * Clear non-persistent notifications only
     */
    clearNonPersistent() {
        this.notifications = this.notifications.filter(n => n.persistent);
    }
    /**
     * Update a notification
     */
    update(id, updates) {
        const notification = this.notifications.find(n => n.id === id);
        if (notification) {
            Object.assign(notification, updates);
            return true;
        }
        return false;
    }
    /**
     * Check if a notification exists
     */
    exists(id) {
        return this.notifications.some(n => n.id === id);
    }
    /**
     * Get notification count by type
     */
    getCountByType(type) {
        return this.notifications.filter(n => n.type === type).length;
    }
    // Convenience methods for different notification types
    success(message, options) {
        return this.add({ ...options, message, type: 'success' });
    }
    error(message, options) {
        return this.add({ ...options, message, type: 'error' });
    }
    warning(message, options) {
        return this.add({ ...options, message, type: 'warning' });
    }
    info(message, options) {
        return this.add({ ...options, message, type: 'info' });
    }
    /**
     * Show a loading notification that can be updated
     */
    loading(message, options) {
        return this.add({
            ...options,
            message,
            type: 'info',
            persistent: true,
            icon: 'loading'
        });
    }
    /**
     * Convert loading notification to success/error
     */
    resolveLoading(id, success, message) {
        return this.update(id, {
            type: success ? 'success' : 'error',
            message,
            persistent: false,
            duration: success ? 3000 : 5000,
            icon: undefined
        });
    }
    getDefaultDuration(type) {
        return this.config.defaultDuration[type];
    }
}
// Context management
const NOTIFICATION_KEY = Symbol('notifications');
export function createNotificationContext(config) {
    const manager = new NotificationManager(config);
    setContext(NOTIFICATION_KEY, manager);
    return manager;
}
export function getNotificationContext() {
    const context = getContext(NOTIFICATION_KEY);
    if (!context) {
        throw new Error('NotificationManager context not found. Make sure to call createNotificationContext() in a parent component.');
    }
    return context;
}
// Utility function for components that want to use notifications
export function useNotifications() {
    return getNotificationContext();
}
