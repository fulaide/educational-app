import type { SidebarProps } from './Sidebar.types.js';
interface Props extends SidebarProps {
    children?: import('svelte').Snippet;
}
declare const Sidebar: import("svelte").Component<Props, {}, "">;
type Sidebar = ReturnType<typeof Sidebar>;
export default Sidebar;
