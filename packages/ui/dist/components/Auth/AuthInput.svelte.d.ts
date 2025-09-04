interface Props {
    id: string;
    name: string;
    type?: 'text' | 'email' | 'tel' | 'url';
    label: string;
    placeholder?: string;
    value: string;
    required?: boolean;
    disabled?: boolean;
    autocomplete?: string;
    error?: string;
    class?: string;
}
declare const AuthInput: import("svelte").Component<Props, {}, "value">;
type AuthInput = ReturnType<typeof AuthInput>;
export default AuthInput;
