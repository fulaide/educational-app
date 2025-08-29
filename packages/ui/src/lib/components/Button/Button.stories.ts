import type { Meta, StoryObj } from '@storybook/svelte';
import Button from './Button.svelte';

const meta: Meta<Button> = {
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
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		children: () => 'Button',
	},
};

export const Primary: Story = {
	args: {
		variant: 'solid',
		color: 'primary',
		children: () => 'Primary Button',
	},
};

export const Outline: Story = {
	args: {
		variant: 'outline',
		color: 'primary',
		children: () => 'Outline Button',
	},
};

export const Ghost: Story = {
	args: {
		variant: 'ghost',
		color: 'primary',
		children: () => 'Ghost Button',
	},
};

export const Loading: Story = {
	args: {
		loading: true,
		children: () => 'Loading...',
	},
};

export const Disabled: Story = {
	args: {
		disabled: true,
		children: () => 'Disabled Button',
	},
};

export const Sizes: Story = {
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

export const Colors: Story = {
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

export const Variants: Story = {
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