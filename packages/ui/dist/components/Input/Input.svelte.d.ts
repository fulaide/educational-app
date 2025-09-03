type InputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
type InputSize = 'sm' | 'md' | 'lg';
interface Props {
    type?: InputType;
    size?: InputSize;
    placeholder?: string;
    value?: string;
    label?: string;
    error?: string;
    hint?: string;
    disabled?: boolean;
    required?: boolean;
    readonly?: boolean;
    autocomplete?: string;
    maxlength?: number;
    minlength?: number;
    pattern?: string;
    id?: string;
    name?: string;
    class?: string;
    onchange?: (value: string) => void;
    oninput?: (value: string) => void;
    onfocus?: () => void;
    onblur?: () => void;
}
declare const Input: import("svelte").Component<Props, {}, "value">;
type Input = ReturnType<typeof Input>;
export default Input;
