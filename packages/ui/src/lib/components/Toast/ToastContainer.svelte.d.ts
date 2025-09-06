interface Props {
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center';
    maxVisible?: number;
}
declare const ToastContainer: import("svelte").Component<Props, {}, "">;
type ToastContainer = ReturnType<typeof ToastContainer>;
export default ToastContainer;
