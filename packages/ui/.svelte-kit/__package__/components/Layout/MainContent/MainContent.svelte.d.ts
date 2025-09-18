import type { MainContentProps } from './MainContent.types.js';
interface Props extends MainContentProps {
    children?: import('svelte').Snippet;
}
declare const MainContent: import("svelte").Component<Props, {}, "">;
type MainContent = ReturnType<typeof MainContent>;
export default MainContent;
