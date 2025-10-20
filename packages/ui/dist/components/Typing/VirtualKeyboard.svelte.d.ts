interface Props {
    currentChar?: string | null;
    pressedKey?: string | null;
    showFingerGuide?: boolean;
    highlightZone?: 'left' | 'center' | 'right' | null;
    highlightKey?: string | null;
    class?: string;
}
declare const VirtualKeyboard: import("svelte").Component<Props, {}, "">;
type VirtualKeyboard = ReturnType<typeof VirtualKeyboard>;
export default VirtualKeyboard;
