import type { WordState } from '@educational-app/learning';
interface Props {
    words: WordState[];
    currentWordIndex: number;
    windowSize?: number;
    class?: string;
}
declare const TextDisplay: import("svelte").Component<Props, {}, "">;
type TextDisplay = ReturnType<typeof TextDisplay>;
export default TextDisplay;
