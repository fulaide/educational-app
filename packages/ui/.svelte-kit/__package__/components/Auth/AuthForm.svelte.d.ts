import type { Snippet } from 'svelte';
interface Props {
    children: Snippet;
    onSubmit?: (loading: boolean) => void;
    onResult?: (data: {
        result: any;
        update: () => Promise<void>;
    }) => Promise<void>;
    class?: string;
}
declare const AuthForm: import("svelte").Component<Props, {}, "">;
type AuthForm = ReturnType<typeof AuthForm>;
export default AuthForm;
