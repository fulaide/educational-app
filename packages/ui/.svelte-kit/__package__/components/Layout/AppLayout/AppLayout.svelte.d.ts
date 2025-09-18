import type { AppLayoutProps } from './AppLayout.types.js';
interface Props extends AppLayoutProps {
    children?: import('svelte').Snippet;
}
declare const AppLayout: import("svelte").Component<Props, {}, "">;
type AppLayout = ReturnType<typeof AppLayout>;
export default AppLayout;
