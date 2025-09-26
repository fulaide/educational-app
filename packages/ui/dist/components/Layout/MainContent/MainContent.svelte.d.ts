interface Props {
    children?: import('svelte').Snippet;
    title?: string;
    subtitle?: string;
    headerActions?: Array<{
        id: string;
        label: string;
        icon?: any;
    }>;
    class?: string;
    padding?: string;
}
declare const MainContent: import("svelte").Component<Props, {}, "">;
type MainContent = ReturnType<typeof MainContent>;
export default MainContent;
