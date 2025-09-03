import { type ColorVariant } from '../../utils/index.js';
import type { Snippet } from 'svelte';
type ButtonVariant = 'solid' | 'outline' | 'ghost' | 'soft';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';
interface Props {
    variant?: ButtonVariant;
    color?: ColorVariant;
    size?: ButtonSize;
    disabled?: boolean;
    loading?: boolean;
    fullWidth?: boolean;
    rounded?: boolean;
    type?: 'button' | 'submit' | 'reset';
    onclick?: () => void;
    class?: string;
    children?: Snippet;
}
declare const Button: import("svelte").Component<Props, {}, "">;
type Button = ReturnType<typeof Button>;
export default Button;
