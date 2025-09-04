interface Props {
    links: Array<{
        href: string;
        text: string;
        variant?: 'primary' | 'secondary';
    }>;
    class?: string;
}
declare const AuthLinks: import("svelte").Component<Props, {}, "">;
type AuthLinks = ReturnType<typeof AuthLinks>;
export default AuthLinks;
