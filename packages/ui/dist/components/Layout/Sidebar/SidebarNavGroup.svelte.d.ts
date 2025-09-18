import type { Snippet } from 'svelte';
interface Props {
    title?: string;
    isCollapsed?: boolean;
    children: Snippet;
    class?: string;
}
declare const SidebarNavGroup: import("svelte").Component<Props, {}, "">;
type SidebarNavGroup = ReturnType<typeof SidebarNavGroup>;
export default SidebarNavGroup;
