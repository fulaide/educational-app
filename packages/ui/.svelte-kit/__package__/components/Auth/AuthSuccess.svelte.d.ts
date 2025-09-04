import type { Snippet } from 'svelte';
interface Props {
    title: string;
    message?: string;
    actions?: Snippet;
    class?: string;
}
declare const AuthSuccess: import("svelte").Component<Props, {}, "">;
type AuthSuccess = ReturnType<typeof AuthSuccess>;
export default AuthSuccess;
