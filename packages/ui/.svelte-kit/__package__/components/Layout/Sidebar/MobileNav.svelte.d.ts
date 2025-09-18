import type { MobileNavProps } from './Sidebar.types.js';
interface Props extends MobileNavProps {
    headerContent?: import('svelte').Snippet;
    navigationContent?: import('svelte').Snippet;
    footerContent?: import('svelte').Snippet;
    beforeBrand?: import('svelte').Snippet;
    afterBrand?: import('svelte').Snippet;
    beforeNavigation?: import('svelte').Snippet;
    afterNavigation?: import('svelte').Snippet;
}
declare const MobileNav: import("svelte").Component<Props, {}, "">;
type MobileNav = ReturnType<typeof MobileNav>;
export default MobileNav;
