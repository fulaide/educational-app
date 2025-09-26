interface Props {
    navigation?: Array<{
        title?: string;
        items?: Array<{
            id: string;
            label: string;
            icon?: any;
            isActive?: boolean;
            badge?: string | number;
            href?: string;
        }>;
    }>;
    brand?: {
        name: string;
        logo?: string;
    };
    footer?: {
        user?: {
            name: string;
            email?: string;
            avatar?: string;
        };
        actions?: Array<{
            id: string;
            label: string;
            icon?: any;
        }>;
    };
    onNavigate?: (item: any) => void;
    adSlot?: import('svelte').Snippet;
}
declare const Sidebar: import("svelte").Component<Props, {}, "">;
type Sidebar = ReturnType<typeof Sidebar>;
export default Sidebar;
