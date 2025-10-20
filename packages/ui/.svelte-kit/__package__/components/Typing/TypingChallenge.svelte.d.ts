import type { TypingMetrics } from '@educational-app/learning';
interface Props {
    text: string;
    timeLimit?: number;
    bonusTime?: number;
    enableSounds?: boolean;
    enableHints?: boolean;
    showKeyboard?: boolean;
    onComplete?: (metrics: TypingMetrics, xp: number, achievements: string[]) => void;
    class?: string;
}
declare const TypingChallenge: import("svelte").Component<Props, {}, "">;
type TypingChallenge = ReturnType<typeof TypingChallenge>;
export default TypingChallenge;
