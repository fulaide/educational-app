interface Props {
    id: string;
    name: string;
    label: string;
    placeholder?: string;
    value: string;
    required?: boolean;
    disabled?: boolean;
    autocomplete?: string;
    error?: string;
    showStrength?: boolean;
    class?: string;
}
declare const AuthPasswordInput: import("svelte").Component<Props, {}, "value">;
type AuthPasswordInput = ReturnType<typeof AuthPasswordInput>;
export default AuthPasswordInput;
