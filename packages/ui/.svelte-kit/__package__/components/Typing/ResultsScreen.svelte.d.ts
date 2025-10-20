import type { TypingMetrics } from '@educational-app/learning';
interface Props {
    metrics: TypingMetrics;
    achievements: string[];
    xpEarned: number;
    onRestart?: () => void;
    onNext?: () => void;
    onExit?: () => void;
    class?: string;
}
declare const ResultsScreen: import("svelte").Component<Props, {}, "">;
type ResultsScreen = ReturnType<typeof ResultsScreen>;
export default ResultsScreen;
