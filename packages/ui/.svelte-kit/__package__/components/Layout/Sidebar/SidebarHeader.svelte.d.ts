import type { Snippet } from 'svelte';
interface Props {
    children: Snippet;
    class?: string;
}
declare const SidebarHeader: import("svelte").Component<Props, {}, "">;
type SidebarHeader = ReturnType<typeof SidebarHeader>;
export default SidebarHeader;
