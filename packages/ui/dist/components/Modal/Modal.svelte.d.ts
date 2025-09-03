import type { Snippet } from 'svelte';
interface Props {
    open: boolean;
    title?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
    closable?: boolean;
    persistent?: boolean;
    class?: string;
    children?: Snippet;
    onclose?: () => void;
}
interface $$__sveltets_2_IsomorphicComponent<Props extends Record<string, any> = any, Events extends Record<string, any> = any, Slots extends Record<string, any> = any, Exports = {}, Bindings = string> {
    new (options: import('svelte').ComponentConstructorOptions<Props>): import('svelte').SvelteComponent<Props, Events, Slots> & {
        $$bindings?: Bindings;
    } & Exports;
    (internal: unknown, props: Props & {
        $$events?: Events;
        $$slots?: Slots;
    }): Exports & {
        $set?: any;
        $on?: any;
    };
    z_$$bindings?: Bindings;
}
declare const Modal: $$__sveltets_2_IsomorphicComponent<Props, {
    close: CustomEvent<any>;
} & {
    [evt: string]: CustomEvent<any>;
}, {}, {}, "open">;
type Modal = InstanceType<typeof Modal>;
export default Modal;
