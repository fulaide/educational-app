import type { ConfirmationDialogProps } from './ConfirmationDialog.types.js';
interface Props extends ConfirmationDialogProps {
    children?: import('svelte').Snippet;
}
declare const ConfirmationDialog: import("svelte").Component<Props, {}, "open">;
type ConfirmationDialog = ReturnType<typeof ConfirmationDialog>;
export default ConfirmationDialog;
