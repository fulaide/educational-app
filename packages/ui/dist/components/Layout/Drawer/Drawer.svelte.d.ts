import type { DrawerProps } from './Drawer.types.js';
interface Props extends DrawerProps {
    children?: import('svelte').Snippet;
    header?: import('svelte').Snippet;
    footer?: import('svelte').Snippet;
}
declare const Drawer: import("svelte").Component<Props, {}, "isOpen" | "open">;
type Drawer = ReturnType<typeof Drawer>;
export default Drawer;
