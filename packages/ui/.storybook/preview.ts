import type { Preview } from '@storybook/svelte';
import '../src/styles.css';

const preview: Preview = {
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
		backgrounds: {
			default: 'light',
			values: [
				{ name: 'light', value: '#ffffff' },
				{ name: 'gray', value: '#f3f4f6' },
				{ name: 'dark', value: '#1f2937' },
			],
		},
		layout: 'centered',
	},
	tags: ['autodocs'],
};

export default preview;