import type { ComponentType } from 'svelte';
interface Props {
    href?: string;
    icon?: ComponentType;
    iconComponent?: ComponentType;
    iconSrc?: string;
    iconText?: string;
    label: string;
    badge?: string | number;
    isActive?: boolean;
    isCollapsed?: boolean;
    onClick?: () => void;
    class?: string;
}
declare const MenuItem: import("svelte").Component<Props, {}, "">;
type MenuItem = ReturnType<typeof MenuItem>;
export default MenuItem;
