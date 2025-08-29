import type { StorybookConfig } from '@storybook/sveltekit';

const config: StorybookConfig = {
	stories: ['../src/**/*.stories.@(js|ts|svelte)'],
	addons: [
		'@storybook/addon-links',
		'@storybook/addon-essentials',
		'@storybook/addon-interactions',
	],
	framework: {
		name: '@storybook/sveltekit',
		options: {},
	},
	typescript: {
		check: false,
		reactDocgen: 'react-docgen-typescript',
	},
};

export default config;