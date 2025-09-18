import type { MainContentHeaderProps } from './MainContent.types.js';
interface Props extends MainContentHeaderProps {
    children?: import('svelte').Snippet;
    actionsSnippet?: import('svelte').Snippet;
}
declare const MainContentHeader: import("svelte").Component<Props, {}, "">;
type MainContentHeader = ReturnType<typeof MainContentHeader>;
export default MainContentHeader;
