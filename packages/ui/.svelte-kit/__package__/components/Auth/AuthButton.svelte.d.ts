import type { ColorVariant } from '../../utils/index.js';
import type { Snippet } from 'svelte';
interface Props {
    type?: 'button' | 'submit' | 'reset';
    variant?: 'solid' | 'outline' | 'ghost' | 'soft';
    color?: ColorVariant;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    loading?: boolean;
    disabled?: boolean;
    fullWidth?: boolean;
    children?: Snippet;
    class?: string;
    onclick?: () => void;
}
declare const AuthButton: import("svelte").Component<Props, {}, "">;
type AuthButton = ReturnType<typeof AuthButton>;
export default AuthButton;
