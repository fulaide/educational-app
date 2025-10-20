interface Props {
    timeLimit: number;
    onTimeout?: () => void;
    class?: string;
}
declare const TimerBar: import("svelte").Component<Props, {
    start: () => void;
    pause: () => void;
    reset: (newTimeLimit?: number) => void;
    addBonusTime: (bonusMs: number) => void;
}, "">;
type TimerBar = ReturnType<typeof TimerBar>;
export default TimerBar;
