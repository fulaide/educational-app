import Button from './Button.svelte';
const meta = {
    title: 'Base/Button',
    component: Button,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: { type: 'select' },
            options: ['solid', 'outline', 'ghost', 'soft'],
        },
        color: {
            control: { type: 'select' },
            options: ['primary', 'secondary', 'success', 'danger', 'warning'],
        },
        size: {
            control: { type: 'select' },
            options: ['sm', 'md', 'lg', 'xl'],
        },
        disabled: {
            control: { type: 'boolean' },
        },
        loading: {
            control: { type: 'boolean' },
        },
        fullWidth: {
            control: { type: 'boolean' },
        },
        rounded: {
            control: { type: 'boolean' },
        },
    },
};
export default meta;
export const Default = {
    args: {
        children: () => 'Button',
    },
};
export const Primary = {
    args: {
        variant: 'solid',
        color: 'primary',
        children: () => 'Primary Button',
    },
};
export const Outline = {
    args: {
        variant: 'outline',
        color: 'primary',
        children: () => 'Outline Button',
    },
};
export const Ghost = {
    args: {
        variant: 'ghost',
        color: 'primary',
        children: () => 'Ghost Button',
    },
};
export const Loading = {
    args: {
        loading: true,
        children: () => 'Loading...',
    },
};
export const Disabled = {
    args: {
        disabled: true,
        children: () => 'Disabled Button',
    },
};
export const Sizes = {
    render: () => ({
        Component: Button,
        props: {},
    }),
    decorators: [
        () => ({
            template: `
				<div class="flex flex-col gap-4 items-center">
					<Button size="sm">Small</Button>
					<Button size="md">Medium</Button>
					<Button size="lg">Large</Button>
					<Button size="xl">Extra Large</Button>
				</div>
			`,
        }),
    ],
};
export const Colors = {
    decorators: [
        () => ({
            template: `
				<div class="flex gap-4 flex-wrap justify-center">
					<Button color="primary">Primary</Button>
					<Button color="secondary">Secondary</Button>
					<Button color="success">Success</Button>
					<Button color="danger">Danger</Button>
					<Button color="warning">Warning</Button>
				</div>
			`,
        }),
    ],
};
export const Variants = {
    decorators: [
        () => ({
            template: `
				<div class="flex gap-4 flex-wrap justify-center">
					<Button variant="solid" color="primary">Solid</Button>
					<Button variant="outline" color="primary">Outline</Button>
					<Button variant="ghost" color="primary">Ghost</Button>
					<Button variant="soft" color="primary">Soft</Button>
				</div>
			`,
        }),
    ],
};
