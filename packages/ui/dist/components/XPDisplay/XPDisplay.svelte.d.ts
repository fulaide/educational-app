interface Props {
    currentXP: number;
    levelXP: number;
    nextLevelXP: number;
    level: number;
    showLevel?: boolean;
    showProgress?: boolean;
    animated?: boolean;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'compact' | 'detailed';
    class?: string;
}
declare const XpDisplay: import("svelte").Component<Props, {}, "">;
type XpDisplay = ReturnType<typeof XpDisplay>;
export default XpDisplay;
