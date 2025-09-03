interface Props {
    current: number;
    total: number;
    showLabel?: boolean;
    showPercentage?: boolean;
    size?: 'sm' | 'md' | 'lg';
    color?: 'primary' | 'success' | 'warning' | 'danger';
    animated?: boolean;
    striped?: boolean;
    class?: string;
}
declare const ProgressBar: import("svelte").Component<Props, {}, "">;
type ProgressBar = ReturnType<typeof ProgressBar>;
export default ProgressBar;
