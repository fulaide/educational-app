import type { Snippet } from 'svelte';
type CardVariant = 'default' | 'elevated' | 'outlined' | 'soft';
type CardPadding = 'none' | 'sm' | 'md' | 'lg' | 'xl';
interface Props {
    variant?: CardVariant;
    padding?: CardPadding;
    hoverable?: boolean;
    clickable?: boolean;
    class?: string;
    onclick?: () => void;
    children?: Snippet;
}
declare const Card: import("svelte").Component<Props, {}, "">;
type Card = ReturnType<typeof Card>;
export default Card;
