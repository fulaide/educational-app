import { QrCode } from 'lucide-svelte';
interface Props {
    data: string;
    size?: number;
    bgColor?: string;
    fgColor?: string;
    level?: 'L' | 'M' | 'Q' | 'H';
    showActions?: boolean;
    title?: string;
    class?: string;
}
declare const QrCode: import("svelte").Component<Props, {}, "">;
type QrCode = ReturnType<typeof QrCode>;
export default QrCode;
