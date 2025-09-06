export interface NotificationOptions {
    id?: string;
    title?: string;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    duration?: number;
    actions?: NotificationAction[];
    persistent?: boolean;
    icon?: string;
}
export interface NotificationAction {
    label: string;
    action: () => void;
    style?: 'primary' | 'secondary' | 'danger';
}
export interface Notification extends Required<Omit<NotificationOptions, 'actions' | 'icon'>> {
    id: string;
    createdAt: number;
    actions: NotificationAction[];
    icon?: string;
}
export type NotificationType = 'success' | 'error' | 'warning' | 'info';
export interface NotificationPosition {
    position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center';
    maxVisible: number;
}
export interface NotificationConfig {
    defaultDuration: Record<NotificationType, number>;
    maxNotifications: number;
    enableSounds: boolean;
    enableAnimations: boolean;
}
