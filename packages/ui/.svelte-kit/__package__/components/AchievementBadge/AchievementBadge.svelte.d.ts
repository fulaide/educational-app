import type { AchievementType } from '@educational-app/types';
interface Props {
    name: string;
    icon?: string;
    type: AchievementType;
    isUnlocked?: boolean;
    isNew?: boolean;
    size?: 'sm' | 'md' | 'lg';
    showLabel?: boolean;
    interactive?: boolean;
    class?: string;
    onclick?: () => void;
}
declare const AchievementBadge: import("svelte").Component<Props, {}, "">;
type AchievementBadge = ReturnType<typeof AchievementBadge>;
export default AchievementBadge;
