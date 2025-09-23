export type ThemeName = 'parent' | 'student' | 'teacher' | 'admin';
export interface ThemeInfo {
    name: ThemeName;
    displayName: string;
    description: string;
    primaryColor: string;
}
export declare const THEME_INFO: Record<ThemeName, ThemeInfo>;
