import { getContext, setContext } from 'svelte';
export class NotificationManager {
    // Use Svelte 5 $state rune for reactivity
    _notifications = $state([]);
    listeners = new Set();
    get notifications() {
        return this._notifications;
    }
    notify() {
        this.listeners.forEach(listener => listener());
    }
    subscribe(listener) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }
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
        while (this._notifications.length >= this.config.maxNotifications) {
            const oldest = this._notifications.find(n => !n.persistent);
            if (oldest) {
                this.remove(oldest.id);
            }
            else {
                break; // All notifications are persistent
            }
        }
        this._notifications.push(notification);
        this.notify();
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
        const index = this._notifications.findIndex(n => n.id === id);
        if (index > -1) {
            this._notifications.splice(index, 1);
            this.notify();
        }
    }
    /**
     * Clear all notifications
     */
    clear() {
        this._notifications = [];
        this.notify();
    }
    /**
     * Clear non-persistent notifications only
     */
    clearNonPersistent() {
        this._notifications = this._notifications.filter(n => n.persistent);
        this.notify();
    }
    /**
     * Update a notification
     */
    update(id, updates) {
        const notification = this._notifications.find(n => n.id === id);
        if (notification) {
            Object.assign(notification, updates);
            this.notify();
            return true;
        }
        return false;
    }
    /**
     * Check if a notification exists
     */
    exists(id) {
        return this._notifications.some(n => n.id === id);
    }
    /**
     * Get notification count by type
     */
    getCountByType(type) {
        return this._notifications.filter(n => n.type === type).length;
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
// Global singleton instance for use without context
// This allows pages and components to use notifications without setting up context
export const notifications = new NotificationManager();
