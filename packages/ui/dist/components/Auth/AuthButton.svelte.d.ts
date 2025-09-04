import type { Snippet } from 'svelte';
interface Props {
    type?: 'button' | 'submit' | 'reset';
    variant?: 'primary' | 'secondary';
    loading?: boolean;
    disabled?: boolean;
    loadingText?: string;
    children: Snippet;
    class?: string;
    onclick?: () => void;
}
declare const AuthButton: import("svelte").Component<Props, {}, "">;
type AuthButton = ReturnType<typeof AuthButton>;
export default AuthButton;
