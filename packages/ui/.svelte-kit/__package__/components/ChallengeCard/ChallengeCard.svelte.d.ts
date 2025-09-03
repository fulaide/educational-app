import type { TaskType, Difficulty } from '@educational-app/types';
interface Props {
    title: string;
    type: TaskType;
    difficulty: Difficulty;
    xpReward: number;
    timeLimit?: number;
    progress?: number;
    totalSteps?: number;
    isCompleted?: boolean;
    isLocked?: boolean;
    thumbnail?: string;
    class?: string;
    onclick?: () => void;
}
declare const ChallengeCard: import("svelte").Component<Props, {}, "">;
type ChallengeCard = ReturnType<typeof ChallengeCard>;
export default ChallengeCard;
